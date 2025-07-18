package com.example.travelbot

import android.util.Log
import android.widget.ScrollView
import android.widget.TextView
import android.view.View
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

object Logger {
    private val logs = StringBuilder()
    private var view: TextView? = null
    private val lock = ReentrantLock()

    enum class LogLevel {
        DEBUG, INFO, WARN, ERROR
    }

    private var currentLogLevel: LogLevel = LogLevel.DEBUG

    fun setLogLevel(level: LogLevel) {
        currentLogLevel = level
    }

    fun attachView(tv: TextView?) {
        lock.withLock {
            view = tv
            view?.text = logs.toString()
        }
    }

    fun log(level: LogLevel, msg: String) {
        if (level.ordinal >= currentLogLevel.ordinal) {
            Log.d("Travelbot", "[$level] $msg")
            lock.withLock {
                logs.append("[$level] ").append(msg).append('\n')
                view?.post {
                    view?.text = logs.toString()
                    (view?.parent as? ScrollView)?.fullScroll(View.FOCUS_DOWN)
                }
            }
        }
    }

    fun debug(msg: String) = log(LogLevel.DEBUG, msg)
    fun info(msg: String) = log(LogLevel.INFO, msg)
    fun warn(msg: String) = log(LogLevel.WARN, msg)
    fun error(msg: String) = log(LogLevel.ERROR, msg)
}
