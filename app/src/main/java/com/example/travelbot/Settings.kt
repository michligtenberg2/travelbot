package com.example.travelbot

import android.content.Context
import android.content.SharedPreferences

object Settings {
    private const val PREFS_NAME = "travelbot_prefs"
    private const val KEY_INTERVAL = "comment_interval"
    private const val KEY_BACKEND_URL = "backend_url"
    private const val KEY_PERSONALITY = "personality"
    private const val KEY_QUIET_MODE = "quiet_mode"
    private const val KEY_API_KEY = "api_key"

    private const val DEFAULT_INTERVAL = 15 // minutes
    private const val DEFAULT_URL = "http://10.0.2.2:5000"
    private const val DEFAULT_PERSONALITY = "Jordanees"
    private const val DEFAULT_QUIET_MODE = false
    private const val DEFAULT_API_KEY = ""

    private fun prefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    fun getInterval(context: Context): Int =
        prefs(context).getInt(KEY_INTERVAL, DEFAULT_INTERVAL)

    fun setInterval(context: Context, minutes: Int) {
        prefs(context).edit().putInt(KEY_INTERVAL, minutes).apply()
    }

    fun getBackendUrl(context: Context): String =
        prefs(context).getString(KEY_BACKEND_URL, DEFAULT_URL) ?: DEFAULT_URL

    fun setBackendUrl(context: Context, url: String) {
        prefs(context).edit().putString(KEY_BACKEND_URL, url).apply()
    }

    fun getPersonality(context: Context): String =
        prefs(context).getString(KEY_PERSONALITY, DEFAULT_PERSONALITY)
            ?: DEFAULT_PERSONALITY

    fun setPersonality(context: Context, p: String) {
        prefs(context).edit().putString(KEY_PERSONALITY, p).apply()
    }

    fun isQuietModeEnabled(context: Context): Boolean =
        prefs(context).getBoolean(KEY_QUIET_MODE, DEFAULT_QUIET_MODE)

    fun setQuietModeEnabled(context: Context, enabled: Boolean) {
        prefs(context).edit().putBoolean(KEY_QUIET_MODE, enabled).apply()
    }

    fun getApiKey(context: Context): String =
        prefs(context).getString(KEY_API_KEY, DEFAULT_API_KEY) ?: DEFAULT_API_KEY

    fun setApiKey(context: Context, apiKey: String) {
        prefs(context).edit().putString(KEY_API_KEY, apiKey).apply()
    }
}
