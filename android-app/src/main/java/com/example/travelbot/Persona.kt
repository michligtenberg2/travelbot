package com.example.travelbot

data class Persona(
    val name: String,
    val backendStyle: String,
    val ttsVoice: String? = null,
    val pitch: Float = 1.0f,
    val speed: Float = 1.0f
)
