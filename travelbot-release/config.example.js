// TravelBot Configuration
// Kopieer dit bestand naar config.js en voeg je eigen instellingen toe

window.TRAVELBOT_CONFIG = {
    // OpenAI API Key - VEREIST
    // Haal je API key op van: https://platform.openai.com/api-keys
    // OpenAI API Key - Replace with your actual key
    OPENAI_API_KEY: 'sk-your-openai-api-key-here',
    
    // Standaard instellingen
    DEFAULT_PERSONA: 'Amsterdammer', // 'Amsterdammer', 'Belg', 'Brabander', of 'Jordanees'
    DEFAULT_INTERVAL_MINUTES: 15,
    DEFAULT_USE_DIRECT_API: true,
    
    // Backend URL (gebruikt als Direct API uitgeschakeld is)
    BACKEND_URL: 'https://travelbot-2k7x.onrender.com',
    
    // Debug modus
    DEBUG: false
};

// Veiligheidscheck - waarschuw als API key niet ingevuld
if (window.TRAVELBOT_CONFIG.OPENAI_API_KEY.startsWith('YOUR_')) {
    console.error('❌ OpenAI API key not configured! Please edit config.js');
    alert('TravelBot configuratie vereist! Bewerk config.js en voeg je OpenAI API key toe.');
}
