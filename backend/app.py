"""Flask backend voor Travelbot.

Dit eenvoudige API-script ontvangt GPS-coördinaten van de Android-app en
vraagt OpenAI om een korte opmerking over de locatie. Het resultaat wordt als
JSON teruggestuurd naar de telefoon zodat Text-to-Speech het kan voorlezen.
"""

from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY environment variable is missing")

@app.route('/comment', methods=['POST'])
def comment():
    """Endpoint dat een opmerking over de huidige locatie retourneert."""
    data = request.get_json()
    lat = data.get('lat')
    lon = data.get('lon')
    question = data.get('question')
    style = data.get('style', 'Jordanees')

    place_summary = get_wikipedia_summary(lat, lon)
    prompt = build_prompt(place_summary, question, style)
    response_text = query_openai(prompt)

    return jsonify(text=response_text)

def get_wikipedia_summary(lat, lon):
    """Geef een korte samenvatting van de plek op basis van Wikipedia."""
    try:
        geo_url = f"https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord={lat}%7C{lon}&gsradius=10000&gslimit=1&format=json"
        geo_resp = requests.get(geo_url).json()
        pages = geo_resp.get("query", {}).get("geosearch", [])
        if not pages:
            return "Er is hier niet veel bijzonders."

        title = pages[0]["title"]
        summary_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}"
        summary_resp = requests.get(summary_url).json()
        return summary_resp.get("extract", f"Iets over {title}.")
    except Exception as e:
        return "Kon geen informatie ophalen."

def build_prompt(summary, question=None, style='Jordanees'):
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
        return base + f"Iemand vraagt je: '{question}'. Wat zeg je?"
    else:
        return base + "Geef één humoristische zin over deze plek."

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
