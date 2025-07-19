package com.example.travelbot

import kotlinx.coroutines.runBlocking
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Test
import org.mockito.Mockito
import java.net.HttpURLConnection
import java.net.URL

class ApiClientTest {

    @Test
    fun testSendLocationAsync() = runBlocking {
        // Mock URL and HttpURLConnection
        val mockUrl = Mockito.mock(URL::class.java)
        val mockConnection = Mockito.mock(HttpURLConnection::class.java)

        Mockito.`when`(mockUrl.openConnection()).thenReturn(mockConnection)
        Mockito.`when`(mockConnection.inputStream).thenReturn(
            "{"text": "Test response"}".byteInputStream()
        )

        // Mock context and settings
        val mockContext = Mockito.mock(android.content.Context::class.java)
        Mockito.`when`(Settings.getBackendUrl(mockContext)).thenReturn("http://mockurl.com")
        Mockito.`when`(Settings.getPersonality(mockContext)).thenReturn("Jordanees")

        // Call the function
        val response = ApiClient.sendLocationAsync(mockContext, 52.3676, 4.9041, "Test question")

        // Assert the response
        assertEquals("Test response", response)
    }
}
