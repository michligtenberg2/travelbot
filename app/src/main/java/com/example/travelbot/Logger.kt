package com.example.travelbot

import android.util.Log
import android.widget.ScrollView
import android.widget.TextView
import android.view.View

object Logger {
    private val logs = StringBuilder()
    private var view: TextView? = null

    fun attachView(tv: TextView?) {
        view = tv
        view?.text = logs.toString()
    }

    fun log(msg: String) {
        Log.d("Travelbot", msg)
        logs.append(msg).append('\n')
        view?.post {
            view?.text = logs.toString()
            (view?.parent as? ScrollView)?.fullScroll(View.FOCUS_DOWN)
        }
    }
}
