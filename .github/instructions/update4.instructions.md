## 🧭 Claude Prompt – TravelBot v4 met Navigatie & Slimme AI

Je werkt aan een sarcastische, locatiebewuste AI genaamd **TravelBot**. Voor versie 4 wil ik dat je deze functionaliteit uitbreidt tot een **volwaardig navigatiesysteem**.

### ✳️ Doel

Maak van TravelBot een slimme reisgenoot die:

* Een route kan ontvangen (van A naar B)
* Deze in *real time* navigeert met gesproken instructies (zoals:
  “Over 500 meter, neem de afslag naar N257”)
* Ondertussen AI-gedreven observaties doet over de omgeving, maar **alleen als dat zinnig is**

---

### ✅ Wat je moet doen

#### 1. **Navigatiesysteem bouwen**

* Gebruik een routing API (zoals OpenRouteService, OSRM, of Google Directions API) om stap-voor-stap route-instructies op te halen
* Parseer deze tot een `step queue` met:

  * `instruction` (bijv. "Rechtsaf")
  * `distance_to_user`
  * `road_name` (optioneel)
* Implementeer logica voor `trigger points`:

  * Bijvoorbeeld: spreek instructie uit bij 500m, 100m, en direct voor de bocht

#### 2. **Audio hints geven**

* Gebruik **Web Speech API** voor TTS-output
* Alternatief: preload korte `.mp3` samples (“Sla nu linksaf”)
* Teksten moeten realistisch klinken voor een navigatieapp:

  * Bijv. “Over 200 meter linksaf naar de N44 richting Den Haag”

#### 3. **AI-observaties verbeteren**

* Laat TravelBot z’n sarcastische opmerkingen *alleen* doen als:

  * De locatie of omgeving daartoe uitnodigt (stadscentrum, bekende plek, rare straatnamen)
  * Er geen actieve navigatie-instructie bezig is
* Denk in AI-logica: `"Kan ik iets inhoudelijks zeggen over deze plek?"`
* Gebruik reverse geocoding om plaatsnamen of POI's te herkennen

#### 4. **Interface**

* Toon kaart (Leaflet of Google Maps)
* Toon huidige locatie, volgende stap, gesproken tekstlog

---

### 📱 Deploymentvraag

Is het mogelijk om hiervan een **iOS-app te maken zonder Apple Developer account**?

⚠️ Graag uitleg bij:

* Deployment via Xcode (zonder App Store)
* Werkt **WebApp via homescreen** met GPS en audio?
* Alternatieven voor TestFlight/Enterprise signing?

---

### 🧠 Opmerking

Momenteel zegt TravelBot vaak dingen die nergens op slaan. Kun je de AI-engine herschrijven zodat het systeem **semantisch zinnige** observaties doet? Dus:

* Plaatsgebonden
* Alleen als de route het toelaat
* Geen herhaling of spam
