package com.example.travelbot

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView

class PersonaListAdapter(context: Context, private val personas: List<String>) : ArrayAdapter<String>(context, 0, personas) {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = convertView ?: LayoutInflater.from(context).inflate(android.R.layout.simple_list_item_single_choice, parent, false)
        val personaName = view.findViewById<TextView>(android.R.id.text1)
        personaName.text = personas[position]
        return view
    }
}
