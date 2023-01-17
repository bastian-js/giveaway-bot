const { loadCommands } = require("../../Handlers/Commands");

module.exports = {
  name: "ready",
  once: true,

  execute(client) {
    console.log("Der Bot ist bereit!");

    client.user.setActivity(`with ${client.guilds.cache.size} guilds`);

    loadCommands(client);
  },
};
