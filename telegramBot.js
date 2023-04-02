import TelegramApi from 'node-telegram-bot-api';
import dotenv from 'dotenv';

import {
  startMsg,
  helpMsg,
  authMsg,
  registrationMsg,
  addArticleMsg,
  ratingMsg
} from './messages.js';

dotenv.config();

const token = process.env.REACT_APP_TELEGRAM_TOKEN;
const adminChatId = process.env.REACT_APP_ADMIN_CHAT_ID;

const bot = new TelegramApi(token, { polling: true });

// обробляємо кожне вхідне повідомлення
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  try {
    //стартове повідомлення від бота
    if (msg.text === '/start' || msg.text === '/info') {
      await bot.sendPhoto(chatId, 'https://www.ccblog.com.ua/img/logo/logo.jpg', {
        caption: startMsg,
        parse_mode: 'HTML',
        reply_markup: {
          keyboard: [
            ['/info', '/help'],
            ['/authorization', '/registration'],
            ['/addArticle', '/rating']
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
      await bot.sendMessage(chatId, 'Готовий прийняти Ваш запит.');
      return;
    }
    //інструкція з користування
    if (msg.text === '/help') {
      // await bot.sendMessage(chatId, 'Цей розділ покищо в розробці');
      await bot.sendMessage(chatId, helpMsg, { parse_mode: 'HTML' });
      return;
    }
    //інструкція з авторизації
    if (msg.text === '/authorization') {
      await bot.sendMessage(chatId, authMsg, { parse_mode: 'HTML' });
      return;
    }
    //інструкція з авторизації
    if (msg.text === '/registration') {
      await bot.sendMessage(chatId, registrationMsg, { parse_mode: 'HTML' });
      return;
    }
    //інструкція з авторизації
    if (msg.text === '/addArticle') {
      await bot.sendMessage(chatId, addArticleMsg, { parse_mode: 'HTML' });
      return;
    }
    //інструкція з авторизації
    if (msg.text === '/rating') {
      await bot.sendMessage(chatId, ratingMsg, { parse_mode: 'HTML' });
      return;
    }

    //ігноруємо повідомлення від адміністратора
    if (String(chatId) === adminChatId) {
      return;
    }

    // пересилаємо повідомлення від користувача адміністратору
    await bot.forwardMessage(adminChatId, chatId, msg.message_id);
    await bot.sendMessage(
      chatId,
      'Дякую за звернення!\nВаш запит успішно прийнято і буде розглянуто у найкоротший термін.'
    );
  } catch (err) {
    console.log(err);
  }
});

// обробляємо кожну відповідь від адміністратора
bot.on('message', (msg) => {
  //ігноруємо повідомлення від користувачів
  if (!msg.reply_to_message) {
    return;
  }
  console.log(msg);
  try {
    // отримуємо chat_id та текст з оригінального повідомлення
    const originalChatId = msg.reply_to_message.forward_from.id;
    const originalChatText = msg.reply_to_message.text;
    //формуємо відповідь
    const answerMsg =
      `<b>Отримано відповідь на Ваше звернення:</b>\n` +
      `${originalChatText}\n\n` +
      '<b>Відповідь:</b>\n' +
      `${msg.text}`;
    // відправляємо відповідь адміністратора користувачеві
    bot.sendMessage(originalChatId, answerMsg, { parse_mode: 'HTML' });
  } catch (err) {
    console.log(err);
  }
});
