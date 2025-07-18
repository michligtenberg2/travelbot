package com.example.travelbot.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

/**
 * Data Access Object for location cache operations
 */
@Dao
interface LocationCacheDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLocationResponse(locationCache: LocationCache)
    
    @Query("SELECT * FROM location_cache WHERE id = :id LIMIT 1")
    suspend fun getLocationResponse(id: String): LocationCache?
    
    @Query("SELECT * FROM location_cache WHERE timestamp > :since ORDER BY timestamp DESC")
    fun getRecentResponses(since: Long): Flow<List<LocationCache>>
    
    @Query("DELETE FROM location_cache WHERE timestamp < :before")
    suspend fun deleteOldEntries(before: Long)
    
    @Query("DELETE FROM location_cache")
    suspend fun clearAll()
}