const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

// Environment configuration
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Initialize bot with polling
const bot = new TelegramBot(TOKEN, { polling: true });

// API integration layer
const cryptoAPI = {
  /**
   * Fetches top cryptocurrencies by market cap
   * @param {number} limit - Number of results to return
   * @returns {Promise<Array>} - Array of cryptocurrency objects
   */
  async getTopCryptos(limit = 10) {
    try {
      const response = await axios.get(`${COINGECKO_API_BASE}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top cryptos:', error.message);
      throw new Error('Unable to fetch cryptocurrency data');
    }
  },

  /**
   * Fetches trending cryptocurrencies
   * @param {number} limit - Number of results to return
   * @returns {Promise<Array>} - Array of trending coin objects
   */
  async getTrendingCryptos(limit = 5) {
    try {
      const response = await axios.get(`${COINGECKO_API_BASE}/search/trending`);
      return response.data.coins.slice(0, limit);
    } catch (error) {
      console.error('Error fetching trending cryptos:', error.message);
      throw new Error('Unable to fetch trending cryptocurrency data');
    }
  }
};

// Response formatter
const formatter = {
  /**
   * Formats top cryptocurrencies data into readable text
   * @param {Array} cryptos - Array of cryptocurrency objects
   * @returns {string} - Formatted text response
   */
  formatTopCryptos(cryptos) {
    if (!cryptos || cryptos.length === 0) {
      return 'No cryptocurrency data available.';
    }

    let response = '🔸 *TOP CRYPTOCURRENCIES* 🔸\n\n';
    
    cryptos.forEach((crypto, index) => {
      const priceChangeSymbol = crypto.price_change_percentage_24h >= 0 ? '🟢' : '🔴';
      const priceChange = crypto.price_change_percentage_24h 
        ? `${priceChangeSymbol} ${Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%` 
        : 'N/A';
      
      response += `${index + 1}. *${crypto.name}* (${crypto.symbol.toUpperCase()})\n`;
      response += `   💰 $${crypto.current_price.toLocaleString()}\n`;
      response += `   📊 24h: ${priceChange}\n`;
      response += `   🧢 $${(crypto.market_cap / 1e9).toFixed(2)}B\n\n`;
    });

    return response;
  },

  /**
   * Formats trending cryptocurrencies data into readable text
   * @param {Array} trendingCoins - Array of trending coin objects
   * @returns {string} - Formatted text response
   */
  formatTrendingCryptos(trendingCoins) {
    if (!trendingCoins || trendingCoins.length === 0) {
      return 'No trending cryptocurrency data available.';
    }

    let response = '🔥 *TRENDING CRYPTOCURRENCIES* 🔥\n\n';
    
    trendingCoins.forEach((item, index) => {
      const coin = item.item;
      response += `${index + 1}. *${coin.name}* (${coin.symbol.toUpperCase()})\n`;
      response += `   📈 Market Cap Rank: ${coin.market_cap_rank || 'N/A'}\n`;
      response += `   📊 Score: ${coin.score || 'N/A'}\n\n`;
    });

    return response;
  }
};

// Command handlers
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = `
Welcome to the Crypto Info Bot!

Available commands:
/top - Get top cryptocurrencies by market cap
/hot - Get trending cryptocurrencies
/help - Show this help message
`;
  bot.sendMessage(chatId, message);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const message = `
Crypto Info Bot Commands:
/top - Get top cryptocurrencies by market cap
/hot - Get trending cryptocurrencies
`;
  bot.sendMessage(chatId, message);
});

bot.onText(/\/top/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    await bot.sendMessage(chatId, 'Fetching top cryptocurrencies...');
    const topCryptos = await cryptoAPI.getTopCryptos(10);
    const formattedResponse = formatter.formatTopCryptos(topCryptos);
    bot.sendMessage(chatId, formattedResponse, { parse_mode: 'Markdown' });
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
});

bot.onText(/\/hot/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    await bot.sendMessage(chatId, 'Fetching trending cryptocurrencies...');
    const trendingCryptos = await cryptoAPI.getTrendingCryptos(5);
    const formattedResponse = formatter.formatTrendingCryptos(trendingCryptos);
    bot.sendMessage(chatId, formattedResponse, { parse_mode: 'Markdown' });
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
});

// Error handler
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// Start the bot
console.log('Bot is running...');