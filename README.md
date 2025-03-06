# Telegram Cryptocurrency Bot Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Telegram account

## Installation Steps

### 1. Clone Repository or Create Project Folder
```bash
mkdir crypto-telegram-bot
cd crypto-telegram-bot
```

### 2. Initialize Project
```bash
npm init -y
```

### 3. Install Dependencies
```bash
npm install node-telegram-bot-api axios dotenv
```

### 4. Create Bot on Telegram
- Open Telegram and search for "@BotFather"
- Send the command `/newbot`
- Follow the instructions to create your bot
- Save the API token provided by BotFather

### 5. Configure Environment Variables
Create a `.env` file in your project root:
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

### 6. Create Main Bot File
Create an `index.js` file and paste the provided code

### 7. Start the Bot
```bash
node index.js
```

### 8. Testing the Bot
- Open Telegram and search for your bot by the username you gave it
- Start a conversation with your bot
- Send the `/start` command to initialize the bot
- Try the `/top` and `/hot` commands

## Maintenance Notes
- The free CoinGecko API has rate limits (around 50 calls/minute)
- If deployed, consider implementing a simple cache to reduce API calls
- Restart the bot process if it disconnects or encounters errors

## Troubleshooting
- If the bot doesn't respond, verify your token is correct
- If API calls fail, check network connectivity and API status
- For persistent deployment, consider using a process manager like PM2