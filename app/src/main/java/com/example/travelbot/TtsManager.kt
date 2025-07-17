package com.example.travelbot

import android.content.Context
import android.speech.tts.TextToSpeech
import java.util.Locale

class TtsManager(private val ctx: Context) : TextToSpeech.OnInitListener {

    private var tts: TextToSpeech = TextToSpeech(ctx, this)

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts.language = Locale("nl", "NL")
        }
    }

    fun speak(text: String) {
        if (QuietMode.isSleeping(ctx)) return
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "henk")
    }

    fun shutdown() {
        tts.shutdown()
    }
}