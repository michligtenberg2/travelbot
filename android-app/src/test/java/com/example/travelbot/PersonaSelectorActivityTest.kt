package com.example.travelbot

import android.content.SharedPreferences
import androidx.test.core.app.ActivityScenario
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Assert
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class PersonaSelectorActivityTest {

    @Test
    fun testPersonaDownloadAndStorage() {
        val scenario = ActivityScenario.launch(PersonaSelectorActivity::class.java)

        scenario.onActivity { activity ->
            val sharedPreferences: SharedPreferences = activity.getSharedPreferences("travelbot_prefs", 0)

            // Simulate downloading personas
            activity.downloadAllPersonas()

            // Check if personas are stored locally
            val storedPersona = sharedPreferences.getString("example_persona", null)
            Assert.assertNotNull("Persona should be stored locally", storedPersona)
        }
    }
}
