package com.example.travelbot

import android.content.Context
import android.speech.tts.TextToSpeech
import java.util.Locale

/**
 * TtsManager is verantwoordelijk voor het beheren van Text-to-Speech (TTS)-functionaliteit.
 * Het initialiseert de TTS-engine en biedt methoden om tekst uit te spreken en de engine af te sluiten.
 *
 * @param ctx De context van de applicatie, gebruikt voor toegang tot resources en instellingen.
 */
class TtsManager(private val ctx: Context) : TextToSpeech.OnInitListener {

    private var tts: TextToSpeech = TextToSpeech(ctx, this)

    /**
     * Callback die wordt aangeroepen wanneer de TTS-engine is geïnitialiseerd.
     *
     * @param status De status van de initialisatie (SUCCESS of ERROR).
     */
    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts.language = Locale("nl", "NL") // Stel de taal in op Nederlands.
        }
    }

    /**
     * Spreekt de opgegeven tekst uit, tenzij de QuietMode actief is.
     *
     * @param text De tekst die moet worden uitgesproken.
     */
    fun speak(text: String) {
        if (QuietMode.isSleeping(ctx)) return // Controleer of QuietMode actief is.
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "henk")
    }

    /**
     * Sluit de TTS-engine af om resources vrij te maken.
     */
    fun shutdown() {
        tts.shutdown()
    }
}