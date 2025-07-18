"""Flask backend voor Travelbot.

Dit eenvoudige API-script ontvangt GPS-coördinaten van de Android-app en
vraagt OpenAI om een korte opmerking over de locatie. Het resultaat wordt als
JSON teruggestuurd naar de telefoon zodat Text-to-Speech het kan voorlezen.
"""

from flask import Flask, request, jsonify
import requests
import os
from flasgger import Swagger
from flask_cors import CORS
import asyncio
import httpx
from functools import wraps

app = Flask(__name__)
CORS(app)  # Voeg CORS-ondersteuning toe
Swagger(app)  # Voeg Swagger-documentatie toe

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY environment variable is missing")

# Hardcoded admin credentials
ADMIN_CREDENTIALS = {
    "username": "admin",
    "password": "root"
}

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth = request.authorization
        if auth and auth.username == ADMIN_CREDENTIALS["username"] and auth.password == ADMIN_CREDENTIALS["password"]:
            return f(*args, **kwargs)
        return jsonify({"error": "Unauthorized access"}), 401
    return decorated_function

@app.before_request
def validate_api_key():
    user_api_key = request.headers.get('X-API-KEY')
    if not user_api_key:
        return jsonify({"error": "API key is required"}), 401

    # Optionally, validate the format or length of the API key here
    # Example: if len(user_api_key) != 32:
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
        persona = 'Je bent Henk, een vrolijke Belg uit Antwerpen met een zachte G.'
    elif style == 'Brabander':
        persona = 'Je bent Henk, een gemoedelijke Brabander die met een zachte G praat.'
    else:
        persona = 'Je bent Henk, een Amsterdammer van 58 uit de Jordaan met een grote bek.'

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
                {"role": "system", "content": "Je bent Henk, een Amsterdammer uit de Jordaan."},
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

@app.route('/admin-access', methods=['GET'])
@admin_required
def admin_access():
    return jsonify({"message": "Admin access granted", "api_key": "<YOUR_ADMIN_API_KEY>"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
