# Telegram → OpenAI → Twitter Bot

## 📦 Setup (Glitch)

1. Go to [https://glitch.com](https://glitch.com)
2. Click "New Project" → "Upload Project"
3. Upload this ZIP and unzip it
4. Create a `.env` file and paste your API keys using `.env.example` as reference
5. Set your Telegram webhook:
   ```bash
   https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://your-glitch-app.glitch.me/webhook/<TELEGRAM_BOT_TOKEN>
   ```

## ✅ Usage

- Send a message to your bot on Telegram
- The bot uses OpenAI to generate content
- The content is automatically posted to Twitter
- The bot replies in Telegram confirming the tweet
