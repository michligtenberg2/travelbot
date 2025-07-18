"""Flask backend voor Travelbot.

Dit eenvoudige API-script ontvangt GPS-coördinaten van de Android-app en
vraagt OpenAI om een korte opmerking over de locatie. Het resultaat wordt als
JSON teruggestuurd naar de telefoon zodat Text-to-Speech het kan voorlezen.
"""

from flask import Flask, request, jsonify, session, send_from_directory
import requests
import os
from flasgger import Swagger
from flask_cors import CORS
import asyncio
import httpx
from functools import wraps
import logging
import json
from dotenv import load_dotenv
from flask_caching import Cache
import secrets
import aiofiles
from PIL import Image

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Voeg CORS-ondersteuning toe
Swagger(app)  # Voeg Swagger-documentatie toe

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# Ensure OPENAI_API_KEY is set
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY environment variable is missing")

app.secret_key = os.getenv("SECRET_KEY", "default_secret_key")  # Set a secret key for session management

# Load admin credentials from environment variables
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "root")

# Generate a secure token for admin access
ADMIN_TOKEN = secrets.token_hex(16)

# Define admin credentials
ADMIN_CREDENTIALS = {
    "username": "admin",
    "password": "securepassword123"
}

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configure caching
app.config['CACHE_TYPE'] = 'SimpleCache'  # Use SimpleCache for development
app.config['CACHE_DEFAULT_TIMEOUT'] = 300  # Cache timeout in seconds
cache = Cache(app)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth = request.authorization
        if auth and auth.username == ADMIN_CREDENTIALS["username"] and auth.password == ADMIN_CREDENTIALS["password"]:
            return f(*args, **kwargs)
        return jsonify({"error": "Unauthorized access"}), 401
    return decorated_function

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("logged_in"):
            return jsonify({"error": "Unauthorized access"}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.before_request
def validate_api_key():
    user_api_key = request.headers.get('X-API-KEY')
    logger.info(f"Received API key: {user_api_key}")  # Log the received API key
    if not user_api_key:
        logger.warning("API key is missing")  # Log a warning if the API key is missing
        return jsonify({"error": "API key is required"}), 401

    # Optionally, validate the format or length of the API key here
    # Example: if len(user_api_key) != 32:
    #             logger.error("Invalid API key format")
    #             return jsonify({"error": "Invalid API key format"}), 401

@app.route('/comment', methods=['POST'])
def comment():
    """Endpoint dat een opmerking over de huidige locatie retourneert.
    ---
    parameters:
      - name: lat
        in: body
        type: number
        required: true
        description: Latitude van de locatie.
      - name: lon
        in: body
        type: number
        required: true
        description: Longitude van de locatie.
      - name: question
        in: body
        type: string
        required: false
        description: Optionele vraag om mee te sturen.
      - name: style
        in: body
        type: string
        required: false
        description: Stijl van de opmerking (bijv. 'Jordanees').
    responses:
      200:
        description: Een opmerking over de locatie.
        schema:
          type: object
          properties:
            text:
              type: string
              description: De gegenereerde opmerking.
    """
    data = request.get_json()
    lat = data.get('lat')
    lon = data.get('lon')
    question = data.get('question')
    style = data.get('style', 'Jordanees')

    if not lat or not lon:
        return jsonify(error="Latitude en longitude zijn verplicht."), 400

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    place_summary = loop.run_until_complete(get_wikipedia_summary(lat, lon))
    prompt = build_prompt(place_summary, question, style)
    response_text = query_openai(prompt)

    return jsonify(text=response_text)

async def get_wikipedia_summary(lat, lon):
    """Geef een korte samenvatting van de plek op basis van Wikipedia."""
    try:
        geo_url = f"https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord={lat}%7C{lon}&gsradius=10000&gslimit=1&format=json"
        async with httpx.AsyncClient() as client:
            geo_resp = await client.get(geo_url)
            geo_resp.raise_for_status()  # Controleer op HTTP-fouten
            geo_data = geo_resp.json()
            pages = geo_data.get("query", {}).get("geosearch", [])
            if not pages:
                return "Er is hier niet veel bijzonders."

            title = pages[0]["title"]
            summary_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}"
            summary_resp = await client.get(summary_url)
            summary_resp.raise_for_status()  # Controleer op HTTP-fouten
            summary_data = summary_resp.json()
            return summary_data.get("extract", f"Iets over {title}.")
    except httpx.RequestError as e:
        app.logger.error(f"HTTP-fout bij het ophalen van Wikipedia-gegevens: {e}")
        return "Kon geen informatie ophalen vanwege een netwerkfout."
    except Exception as e:
        app.logger.error(f"Onverwachte fout: {e}")
        return "Er is een onverwachte fout opgetreden bij het ophalen van informatie."

def build_prompt(summary, question=None, style='Jordanees', language='nl'):
    """Stel een prompt samen voor het taalmodel."""
    if style == 'Belg':
        persona = 'Je bent Heino, een vrolijke Belg uit Antwerpen met een zachte G.'
    elif style == 'Brabander':
        persona = 'Je bent Heino, een gemoedelijke Brabander die met een zachte G praat.'
    else:
        persona = '''
        Je bent Heino, een Amsterdammer van 58 uit de Jordaan met een grote bek en een droog gevoel voor humor. 
        Je hebt een pleurishekel aan Italië, maar weet er alles over. Je refereert vaak aan je mysterieuze verleden daar, 
        waarbij je hint naar maffiose praktijken zonder het expliciet te maken. Je praat met een Jordanees accent en gebruikt 
        typische Amsterdamse uitdrukkingen zoals "pleuris", "gozer", en "hou je bek". 

        Je houdt ervan om mensen te verrassen met je kennis over obscure Italiaanse gerechten en steden, maar je maakt er 
        altijd een sarcastische opmerking bij. Bijvoorbeeld: "Wist je dat ze in Napels pizza's maken die zo dun zijn dat je 
        ze door de brievenbus kan gooien? Maar ja, wat verwacht je van een land dat espresso in shotglaasjes serveert?"

        Je bent ook een beetje mysterieus over je verleden. Als iemand vraagt wat je in Italië deed, zeg je dingen als: 
        "Ach, laten we zeggen dat ik daar een paar zaken heb afgehandeld. Niks illegaals hoor... meestal." Je hint naar 
        connecties met de maffia, maar je geeft nooit details.

        Je hebt een zwak voor oude Italiaanse films en noemt vaak obscure referenties, zoals: "Dit doet me denken aan die 
        scène in 'La Dolce Vita', maar dan zonder de glamour." Je bent een wandelende encyclopedie over Italië, maar je 
        laat nooit je afkeer voor het land los.

        Je zucht vaak tijdens gesprekken, vooral als het over Italië gaat. Je vindt de Italiaanse keuken niet te vreten 
        en maakt daar constant grappen over. Bijvoorbeeld: "Pasta? Dat is toch gewoon deeg met water? Geef mij maar een 
        broodje bal, dat vult tenminste."
        '''

    base = f"""{persona}
Je praat graag over cultuur en hebt altijd een grappige opmerking.

Samenvatting van de plek:
{summary}

"""
    if question:
        base += f"Iemand vraagt je: '{question}'. Wat zeg je?"
    else:
        base += "Geef één humoristische zin over deze plek."

    if language == 'en':
        base = base.replace('Je', 'You').replace('praat', 'talk').replace('grappige opmerking', 'funny remark')

    return base

def query_openai(prompt):
    """Stuur de prompt naar OpenAI en geef het antwoord terug."""
    try:
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "Je bent Heino, een Amsterdammer uit de Jordaan."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.8
        }
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"]
    except Exception as e:
        return "Ik weet effe niks zinnigs te zeggen, maat."

@app.route('/login', methods=['POST'])
def login():
    """
    Login endpoint
    ---
    parameters:
      - name: username
        in: body
        type: string
        required: true
        description: The admin username
      - name: password
        in: body
        type: string
        required: true
        description: The admin password
    responses:
      200:
        description: Login successful
      401:
        description: Invalid credentials
    """
    data = request.json
    if data.get("username") == ADMIN_USERNAME and data.get("password") == ADMIN_PASSWORD:
        session["logged_in"] = True
        return jsonify({"message": "Login successful", "token": ADMIN_TOKEN}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/logout', methods=['POST'])
def logout():
    """
    Logout endpoint
    ---
    responses:
      200:
        description: Logged out successfully
    """
    session.pop("logged_in", None)
    return jsonify({"message": "Logged out successfully"})

@app.route('/protected-endpoint', methods=['GET'])
@login_required
def protected_endpoint():
    return jsonify({"message": "You have access to this endpoint"})

@app.route('/admin-login', methods=['POST'])
def admin_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        return jsonify({"token": ADMIN_TOKEN}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/admin-access', methods=['GET'])
def admin_access():
    token = request.headers.get('Authorization')
    if token == f"Bearer {ADMIN_TOKEN}":
        return jsonify({"message": "Admin access granted"}), 200
    else:
        return jsonify({"error": "Unauthorized"}), 403

@app.route('/personas', methods=['GET'])
@cache.cached(timeout=300)
def get_personas():
    """Endpoint to list all available personas."""
    personas_dir = os.path.join(os.path.dirname(__file__), 'personas')
    personas = []
    for filename in os.listdir(personas_dir):
        if filename.endswith('.json'):
            with open(os.path.join(personas_dir, filename), 'r') as f:
                persona = json.load(f)
                personas.append({"name": persona["name"], "description": persona["description"]})
    return jsonify(personas)

@app.route('/load-persona/<persona_name>', methods=['GET'])
def load_persona(persona_name):
    """Endpoint to load a specific persona."""
    personas_dir = os.path.join(os.path.dirname(__file__), 'personas')
    persona_file = os.path.join(personas_dir, f'{persona_name}.json')
    if os.path.exists(persona_file):
        with open(persona_file, 'r') as f:
            persona = json.load(f)
        return jsonify(persona)
    return jsonify({"error": "Persona not found"}), 404

@app.route('/upload-persona', methods=['POST'])
def upload_persona():
    """Endpoint to upload a custom persona as a JSON file.
    ---
    parameters:
      - name: persona
        in: body
        type: object
        required: true
        description: The persona data
    responses:
      200:
        description: Persona uploaded successfully
      400:
        description: Bad request, invalid data
      500:
        description: Internal server error
    """
    try:
        persona = request.json
        name = persona.get('name')
        description = persona.get('description')

        if not name or not description:
            return jsonify({'error': 'Name and description are required'}), 400

        # Save persona to a file or database (example: saving to a JSON file)
        with open(f'personas/{name}.json', 'w') as f:
            json.dump(persona, f)

        return jsonify({'message': 'Persona uploaded successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/commits', methods=['GET'])
def get_commits():
    """Endpoint to fetch the latest commits from the GitHub repository.
    ---
    responses:
      200:
        description: A list of latest commits
        schema:
          type: array
          items:
            type: object
            properties:
              message:
                type: string
                description: The commit message.
              author:
                type: string
                description: The name of the author.
              date:
                type: string
                format: date-time
                description: The date of the commit.
    """
    try:
        # Replace with your GitHub repository details
        repo_owner = "michligtenberg2"
        repo_name = "travelbot"
        url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/commits"

        # Optional: Add your GitHub token for authentication
        headers = {"Authorization": "token YOUR_GITHUB_TOKEN"}

        response = requests.get(url, headers=headers)
        response.raise_for_status()

        commits = response.json()
        commit_data = [
            {
                "message": commit["commit"]["message"],
                "author": commit["commit"]["author"]["name"],
                "date": commit["commit"]["author"]["date"]
            }
            for commit in commits[:5]  # Limit to the latest 5 commits
        ]

        return jsonify(commit_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/marketplace', methods=['GET'])
@cache.cached()
def marketplace():
    """Endpoint to list all available personas in the marketplace."""
    marketplace_dir = os.path.join(os.path.dirname(__file__), 'marketplace')
    personas = []
    for filename in os.listdir(marketplace_dir):
        if filename.endswith('.json'):
            with open(os.path.join(marketplace_dir, filename), 'r') as f:
                persona = json.load(f)
                personas.append({"name": persona["name"], "description": persona.get("description", "")})
    return jsonify(personas)

@app.route('/async_marketplace', methods=['GET'])
async def async_marketplace():
    """Asynchronous endpoint to list all available personas in the marketplace."""
    marketplace_dir = os.path.join(os.path.dirname(__file__), 'marketplace')
    personas = []

    async def load_persona(file_path):
        async with aiofiles.open(file_path, mode='r') as f:
            return json.loads(await f.read())

    tasks = [
        load_persona(os.path.join(marketplace_dir, filename))
        for filename in os.listdir(marketplace_dir) if filename.endswith('.json')
    ]

    for persona in await asyncio.gather(*tasks):
        personas.append({"name": persona["name"], "description": persona.get("description", "")})

    return jsonify(personas)

def compress_image(input_path, output_path, quality=85):
    with Image.open(input_path) as img:
        img.save(output_path, "JPEG", optimize=True, quality=quality)

@app.route('/compress/<filename>', methods=['GET'])
@cache.cached(timeout=3600, query_string=True)
def serve_compressed_image(filename):
    input_path = os.path.join('static/images', filename)
    output_path = os.path.join('static/compressed', filename)

    if not os.path.exists(output_path):
        compress_image(input_path, output_path)

    return send_from_directory('static/compressed', filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
