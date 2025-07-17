package com.example.travelbot

import android.content.Context
import android.speech.tts.TextToSpeech
import java.util.Locale

class TtsManager(private val context: Context) : TextToSpeech.OnInitListener {

    private var tts: TextToSpeech = TextToSpeech(context, this)

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts.language = Locale("nl", "NL")
        }
    }

    fun speak(text: String) {
        val persona = PersonaManager.getPersona(Settings.getPersonality(context))
        persona.ttsVoice?.let { voiceName ->
            val voice = tts.voices.firstOrNull { it.name.contains(voiceName, true) }
            if (voice != null) tts.voice = voice
        }
        tts.setPitch(persona.pitch)
        tts.setSpeechRate(persona.speed)
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, persona.name)
    }

    fun shutdown() {
        tts.shutdown()
    }
}