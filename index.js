require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require("discord.js");

const axios = require("axios");
const cheerio = require("cheerio");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Canal onde será enviado
const CHANNEL_ID = "1532295157897232464";

// Cargo que será mencionado
const ROLE_ID = "1532297126120263752";

// Site que será monitorado
const URL = "https://example.com";

let ultimaVersao = "";

client.once("ready", () => {
  console.log(`${client.user.tag} online!`);

  verificarAtualizacao();

  // verifica a cada 5 minutos
  setInterval(verificarAtualizacao, 300000);
});

async function verificarAtualizacao() {
  try {

    const { data } = await axios.get(URL, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0 Safari/537.36",
    "Accept":
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "pt-BR,pt;q=0.9",
    "Referer": "https://deltaexploits.gg/"
  }
});
    const $ = cheerio.load(data);

    const texto = $("body").text();

    const versao =
      texto.match(/\d+\.\d+\.\d+/)?.[0] ||
      texto.match(/\d+\.\d+\.\d+\.\d+/)?.[0] ||
      "Versão desconhecida";

    if (versao === ultimaVersao) return;

    ultimaVersao = versao;

    const canal = await client.channels.fetch(CHANNEL_ID);

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("🚀 Delta Android Update!")
      .setDescription(`**Versão detectada:** ${versao}`)
      .addFields(
        {
          name: "📥 Download",
          value: URL
        },
        {
          name: "📋 Status",
          value: "Nova atualização detectada automaticamente."
        }
      )
      .setTimestamp()
      .setFooter({
        text: "Roblox Scripts Bot"
      });

    await canal.send({
      content: `<@&${ROLE_ID}>`,
      embeds: [embed]
    });

    console.log("Atualização enviada.");

  } catch (err) {
    console.log("Erro:", err.message);
  }
}

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  if (message.content === "!delta") {

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("🚀 Delta Android")
      .addFields({
        name: "📥 Download",
        value: URL
      })
      .setTimestamp();

    message.reply({
      embeds: [embed]
    });

  }

});

client.login(process.env.TOKEN);
