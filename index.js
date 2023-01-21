const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { connect } = require("mongoose");

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();

connect(client.config.Database, {}).then(() =>
  console.log("Der Bot ist mit der Datenbank verbunden!")
);

// Event Handler
const { loadEvents } = require("./Handlers/Events");
loadEvents(client);

// Anti-Crash
require("./Handlers/Anti-Crash.js")(client);

client.login(client.config.Token);
