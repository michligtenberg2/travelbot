package com.example.travelbot

object PersonaManager {
<<<<<<< HEAD
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
=======
    data class Phrase(val label: String, val text: String)

    private val soundboard = mapOf(
        "Jordanees" to listOf(
            Phrase("Zeg iets meligs", "Heb je die gezien? Wat een grap, man!"),
            Phrase("Klaag over verkeer", "Nou, het staat hier weer lekker vast."),
            Phrase("Vraag om een broodje", "Ik lust wel een broodje kroket, jij ook?"),
            Phrase("Geef reisadvies", "Pak gewoon de fiets, ben je zo in de stad."),
            Phrase("Glimlach", "Kijk, zo doen we dat in Mokum!")
        ),
        "Belg" to listOf(
            Phrase("Zeg iets meligs", "Das plezant, hé!"),
            Phrase("Klaag over verkeer", "Amai, wat een file weer."),
            Phrase("Vraag om een biertje", "Goeie pint hier ergens?"),
            Phrase("Geef reisadvies", "Neem de tram, da's gemakkelijk."),
            Phrase("Glimlach", "Schone dag vandaag!")
        ),
        "Brabander" to listOf(
            Phrase("Zeg iets meligs", "Da's kikke, toch?"),
            Phrase("Klaag over verkeer", "Staat weer muurvast joh."),
            Phrase("Vraag om worstenbrood", "Hebde nog un worstenbroodje?"),
            Phrase("Geef reisadvies", "Rij nie te hard, geniet van het uitzicht."),
            Phrase("Glimlach", "Moi hè, maak er wa van!")
        )
    )

    fun getPhrases(persona: String): List<Phrase> =
        soundboard[persona] ?: soundboard["Jordanees"]!!
}

>>>>>>> origin/codex/add-soundboard-feature-to-ui
