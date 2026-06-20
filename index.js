const { Telegraf } = require('telegraf');
const { Mistral } = require('@mistralai/mistralai');

const bot = new Telegraf(process.env.BOT_TOKEN);
const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

bot.start((ctx) => {
  ctx.reply('👋 مرحبا! أرسل اسم الدرس + المادة + المستوى\nمثال: فيزياء كهرباء الصف الثالث');
});

bot.on('text', async (ctx) => {
  const query = ctx.message.text;
  await ctx.reply('🔍 جاري استخراج الدرس...');

  try {
    const chatResponse = await mistral.chat.complete({
      model: "mistral-large-latest",
      messages: [
        { role: "system", content: "أنت معلم عربي متخصص. قدم الدرس بشكل منظم وواضح." },
        { role: "user", content: query }
      ]
    });

    let text = chatResponse.choices[0].message.content;
    if (text.length > 3900) text = text.substring(0, 3900) + "\n\n(الرد طويل... يمكنك طلب تفاصيل أكثر)";

    await ctx.reply(text);
  } catch (err) {
    console.error(err);
    await ctx.reply('❌ حدث خطأ في الاتصال، حاول مرة أخرى.');
  }
});

bot.launch();
console.log('✅ البوت يعمل على Railway');
