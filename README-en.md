# 🚗 Travelbot

[![Docs](https://github.com/michligtenberg2/travelbot/actions/workflows/update-pages.yml/badge.svg)](https://github.com/michligtenberg2/travelbot/actions/workflows/update-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Codespaces Ready](https://github.com/codespaces/badge.svg)](https://github.com/codespaces)
[![Made with Kotlin & Flask](https://img.shields.io/badge/Made%20with-Kotlin%20%26%20Flask-blue)](#)

**Travelbot** is an AI travel buddy that cracks a joke about your location every 15 minutes. It runs on an Android phone and uses a small Flask backend to fetch text from OpenAI.

This file is the English counterpart of the Dutch [README.md](README.md).

## 📦 Installation

1. Ensure **Python 3.11+** and an Android phone with **Android 8+**.
2. Clone the repository and install the requirements:

   ```bash
   git clone https://github.com/michligtenberg2/travelbot.git
   cd travelbot
   pip install flask requests
   ```

3. Set your OpenAI API key:

   ```bash
   export OPENAI_API_KEY=sk-xxx
   ```

4. Start the backend:

   ```bash
   python backend/app.py
   ```

5. Open `app/` in Android Studio, build the app and install the APK on your phone.
6. Enter the backend address in the app and you're good to go!

## 🎬 Example usage

Below you see an example response from Henk and how the pieces fit together.



## 📚 Documentation

More details can be found on the [GitHub Pages site](https://michligtenberg2.github.io/travelbot/). It includes screenshots, the update log and an FAQ.

## 📂 Project structure

```
backend/   Flask API generating responses
app/       Android app written in Kotlin
docs/      Documentation (GitHub Pages)
```

## 🤝 Contributing

Want to contribute to Travelbot? Check out the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines and tips.

## 📄 License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for details.
