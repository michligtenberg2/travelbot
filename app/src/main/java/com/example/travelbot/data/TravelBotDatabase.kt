package com.example.travelbot.data

import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import android.content.Context

/**
 * Room database for caching location responses
 */
@Database(
    entities = [LocationCache::class],
    version = 1,
    exportSchema = false
)
abstract class TravelBotDatabase : RoomDatabase() {
    
    abstract fun locationCacheDao(): LocationCacheDao
    
    companion object {
        @Volatile
        private var INSTANCE: TravelBotDatabase? = null
        
        fun getDatabase(context: Context): TravelBotDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    TravelBotDatabase::class.java,
                    "travelbot_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}