package com.example.travelbot

object PersonaManager {
    private val personas = listOf(
        Persona(
            name = "Henk",
            backendStyle = "Jordanees",
            ttsVoice = null,
            pitch = 1.0f,
            speed = 1.0f
        ),
        Persona(
            name = "Friese boer",
            backendStyle = "Friese boer",
            ttsVoice = null,
            pitch = 0.9f,
            speed = 1.0f
        ),
        Persona(
            name = "Brabander",
            backendStyle = "Brabander",
            ttsVoice = null,
            pitch = 1.2f,
            speed = 1.0f
        ),
        Persona(
            name = "Sarcastische AI",
            backendStyle = "Sarcastische AI",
            ttsVoice = null,
            pitch = 1.0f,
            speed = 1.1f
        )
    )

    fun getPersona(name: String): Persona = personas.find { it.name == name } ?: personas.first()

    fun getNames(): List<String> = personas.map { it.name }

    fun defaultPersona(): Persona = personas.first()
}
