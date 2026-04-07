const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '8215345661:AAG7N79pq1_O4f7QcOovJUBdy7BiU-96xC4';
const CHANNEL = process.env.CHANNEL_ID; // @room731
const CATALOG_URL = 'https://t.me/pstation5bot';

const bot = new TelegramBot(TOKEN, { polling: true });

console.log('Бот запущен...');

// Когда в канале появляется новый пост — добавляем кнопку
bot.on('channel_post', async (msg) => {
  // Игнорируем если пост уже с кнопкой или это служебное сообщение
  if (!msg.text && !msg.caption && !msg.photo && !msg.video) return;
  if (msg.reply_markup) return;

  try {
    await bot.editMessageReplyMarkup(
      {
        inline_keyboard: [[
          {
            text: '🎮 Открыть каталог',
            url: CATALOG_URL
          }
        ]]
      },
      {
        chat_id: msg.chat.id,
        message_id: msg.message_id
      }
    );
    console.log(`Кнопка добавлена к посту ${msg.message_id}`);
  } catch (err) {
    console.error('Ошибка:', err.message);
  }
});

// Обработка ошибок
bot.on('polling_error', (err) => {
  console.error('Polling error:', err.message);
});
