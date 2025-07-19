package com.example.travelbot.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query

@Dao
interface PersonaDao {
    @Query("SELECT * FROM personas")
    suspend fun getAllPersonas(): List<Persona>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPersonas(personas: List<Persona>)
}
