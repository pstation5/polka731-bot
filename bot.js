const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.BOT_TOKEN;
const CATALOG_URL = 'https://t.me/pstation5bot';

const bot = new TelegramBot(TOKEN, { polling: true });

console.log('Бот запущен...');

// Отслеживаем уже обработанные media_group чтобы не дублировать
const processedGroups = new Set();

const addButton = async (chatId, messageId) => {
  try {
    await bot.editMessageReplyMarkup(
      {
        inline_keyboard: [[
          { text: '🎮 Открыть каталог', url: CATALOG_URL }
        ]]
      },
      { chat_id: chatId, message_id: messageId }
    );
    console.log(`Кнопка добавлена к посту ${messageId}`);
  } catch (err) {
    if (!err.message.includes('message is not modified')) {
      console.error('Ошибка:', err.message);
    }
  }
};

bot.on('channel_post', async (msg) => {
  // Для альбомов (media_group) — добавляем кнопку только к первому сообщению группы
  if (msg.media_group_id) {
    if (processedGroups.has(msg.media_group_id)) return;
    processedGroups.add(msg.media_group_id);
    // Небольшая задержка чтобы Telegram успел обработать весь альбом
    setTimeout(() => addButton(msg.chat.id, msg.message_id), 1500);
    return;
  }

  // Одиночные сообщения
  await addButton(msg.chat.id, msg.message_id);
});

bot.on('polling_error', (err) => {
  console.error('Polling error:', err.message);
});
