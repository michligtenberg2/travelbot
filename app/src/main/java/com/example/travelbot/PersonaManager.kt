package com.example.travelbot

import android.speech.tts.TextToSpeech

/**
 * Holds all available personas and their voice profiles.
 */
object PersonaManager {
    data class VoiceProfile(
        val pitch: Float,
        val speechRate: Float,
        val voiceName: String? = null
    )

    data class Persona(
        val name: String,
        val style: String,
        val voice: VoiceProfile
    )

    private val personas = listOf(
        Persona(
            name = "Jordanees",
            style = "Jordanees",
            voice = VoiceProfile(pitch = 1.0f, speechRate = 1.0f)
        ),
        Persona(
            name = "Belg",
            style = "Belg",
            voice = VoiceProfile(pitch = 1.1f, speechRate = 0.95f)
        ),
        Persona(
            name = "Brabander",
            style = "Brabander",
            voice = VoiceProfile(pitch = 0.9f, speechRate = 1.05f)
        )
    )

    val defaultPersona: Persona
        get() = personas.first()

    fun names(): List<String> = personas.map { it.name }

    fun get(name: String): Persona = personas.find { it.name == name } ?: defaultPersona
}
