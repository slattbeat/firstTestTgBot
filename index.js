require('dotenv').config();
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);

bot.command('start', async (ctx) => {
    await ctx.reply('Hi! Im bot.')
})

bot.api.setMyCommands([
    {
        command: 'start', description: 'Запуск бота',
    },
    {
        command: 'share', description: 'Подделиться данными',
    },
    {
        command: 'mood', description: 'Оценить настроение',
    },
    {
        command: 'inline_keyboard', description: 'Адаптивная клавиатура',
    },
]);

bot.command('mood', async (ctx) => {
    const moodKeyboard = new Keyboard().text('Хорошо').row().text('Нормально').row().text('Плохо').placeholder('Выбери').resized().oneTime()
    await ctx.reply('Как настроение?', {
    reply_markup: moodKeyboard
    })
})

bot.command('share', async (ctx) => {
    const shareKeyboard = new Keyboard().requestLocation('Геолокация').requestContact('Контакт').placeholder('Укажи данные').requestPoll('Опрос').resized()
    await ctx.reply('Чем хотите поделится?', {
        reply_markup: shareKeyboard
    })
})

bot.command('inline_keyboard', async (ctx) => {
    const inlineKeyboard = new InlineKeyboard()
    .text('1', 'button-1')
    .text('2', 'button-2')
    .text('3', 'button-3');

    await ctx.reply('Выберите цифру', {
        reply_markup: inlineKeyboard
    })
});

bot.callbackQuery(['button-1', 'button-2', 'button-3'], async (ctx) => {
    await ctx.answerCallbackQuery('Вы выбрали цифру!!!');
    await ctx.reply('Вы выбрали цифру');
})

bot.on(':contact', async (ctx) => {
    await ctx.reply('Спасибо за контакт')
})

bot.on(':location', async (ctx) => {
    await ctx.reply('Спасибо за геолакацию')
})

bot.on(':poll', async (ctx) => {
    await ctx.reply('Спасибо за опрос')
})

bot.hears('Хорошо',async (ctx) => {
    await ctx.reply('Класс!')
})

// bot.on('message', async (ctx) => {
//    await ctx.reply('Wait pls...')
// })

bot.command('say_hello', async (ctx) => {
    await ctx.reply('Hello')
});

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
  });

bot.start();
