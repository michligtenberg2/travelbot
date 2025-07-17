package com.example.travelbot

import android.content.Context
import android.os.Build
import android.speech.tts.TextToSpeech
import java.util.Locale

class TtsManager(private val context: Context) : TextToSpeech.OnInitListener {

    private var tts: TextToSpeech = TextToSpeech(context, this)
    private var currentPersona: String? = null

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts.language = Locale("nl", "NL")
            updateVoice()
        }
    }

    fun speak(text: String) {
        if (currentPersona != Settings.getPersonality(context)) {
            updateVoice()
        }
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "henk")
    }

    private fun updateVoice() {
        val persona = PersonaManager.get(Settings.getPersonality(context))
        currentPersona = persona.name
        tts.setPitch(persona.voice.pitch)
        tts.setSpeechRate(persona.voice.speechRate)
        persona.voice.voiceName?.let { name ->
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                val voice = tts.voices.firstOrNull { it.name == name }
                if (voice != null) tts.voice = voice
            }
        }
    }

    fun shutdown() {
        tts.shutdown()
    }
}