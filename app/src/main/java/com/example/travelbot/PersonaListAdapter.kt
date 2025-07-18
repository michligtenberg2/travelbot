package com.example.travelbot

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ImageView
import android.widget.TextView
import com.bumptech.glide.Glide

class PersonaListAdapter(context: Context, private val personas: List<String>) : ArrayAdapter<String>(context, 0, personas) {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = convertView ?: LayoutInflater.from(context).inflate(android.R.layout.simple_list_item_single_choice, parent, false)
        val personaName = view.findViewById<TextView>(android.R.id.text1)
        val imageView = view.findViewById<ImageView>(R.id.personaImageView)
        personaName.text = personas[position]

        // Load image with Glide
        Glide.with(context)
            .load("https://example.com/images/${personas[position]}.png")
            .placeholder(R.drawable.placeholder)
            .into(imageView)

        return view
    }
}
