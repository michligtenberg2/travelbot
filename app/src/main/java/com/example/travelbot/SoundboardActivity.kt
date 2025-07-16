package com.example.travelbot

import android.media.MediaPlayer
import android.util.Base64
import java.io.File
import java.io.FileOutputStream
import android.os.Bundle
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.ListView
import androidx.appcompat.app.AppCompatActivity

class SoundboardActivity : AppCompatActivity() {

    private val sounds = listOf(
        Pair(R.raw.beep1, "Beep 1"),
        Pair(R.raw.beep2, "Beep 2")
    )
    private var player: MediaPlayer? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_soundboard)

        val list = findViewById<ListView>(R.id.soundList)
        list.adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, sounds.map { it.second })
        list.onItemClickListener = AdapterView.OnItemClickListener { _, _, position, _ ->
            playSound(sounds[position].first)
        }
    }

    private fun playSound(resId: Int) {
        player?.release()
        val base64 = resources.openRawResource(resId).bufferedReader().use { it.readText() }
        val bytes = Base64.decode(base64, Base64.DEFAULT)
        val file = File(cacheDir, "sound.mp3")
        FileOutputStream(file).use { it.write(bytes) }
        player = MediaPlayer().apply {
            setDataSource(file.absolutePath)
            prepare()
            start()
        }
    }

    override fun onDestroy() {
        player?.release()
        super.onDestroy()
    }
}
