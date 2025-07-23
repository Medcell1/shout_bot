const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const Twit = require("twit");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET,
});

app.post(`/webhook/${process.env.TELEGRAM_BOT_TOKEN}`, async (req, res) => {
  const message = req.body.message;
  if (!message || !message.text) return res.sendStatus(200);

  const chatId = message.chat.id;
  const prompt = message.text;

  try {
    const completion = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    const tweet = completion.data.choices[0].message.content;

    await T.post("statuses/update", { status: tweet });

    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: `✅ Tweet posted: "${tweet}"`,
    });
  } catch (error) {
    console.error("Error posting tweet or generating message:", error?.response?.data || error.message);
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: "❌ An error occurred while generating or posting your tweet.",
    });
  }

  res.sendStatus(200);
});

app.get("/", (req, res) => res.send("Bot is running."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
