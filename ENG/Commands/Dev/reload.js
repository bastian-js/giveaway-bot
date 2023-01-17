const {
  ChatInputCommandInteraction,
  Client,
  PermissionsBitField,
  ApplicationCommandOptionType,
} = require("discord.js");
const { loadCommands } = require("../../Handlers/Commands");
const { loadEvents } = require("../../Handlers/Events");

module.exports = {
  name: "reload",
  description: "Reload commands & events",
  developer: true,
  defaultMemberPermissions: PermissionsBitField.Flags.Administrator,
  dmPermission: false,
  botPermissions: ["SendMessages"],
  options: [
    {
      name: "events",
      description: "Reload events",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "commands",
      description: "Reload commands",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const subCommand = interaction.options.getSubcommand("events");

    switch (subCommand) {
      case "events":
        {
          for (const [key, value] of client.events)
            client.removeListener(`${key}`, value, true);

          loadEvents(client);

          interaction.reply({
            content: "Succesfully reloaded events!",
            ephemeral: true,
          });
        }
        break;

      case "commands":
        {
          loadCommands(client);

          interaction.reply({
            content: "Succesfully reloaded commands!",
            ephemeral: true,
          });
        }
        break;
    }
  },
};
