const { ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command)
      return interaction.reply({
        content: "This command is outdated",
        ephemeral: true,
      });

    if (
      command.developer &&
      interaction.user.id !== "310382316339855363" &&
      interaction.user.id !== "400201768396652555"
    )
      return interaction.reply({
        content: "This command is only available for developers.",
        ephemeral: true,
      });

    command.execute(interaction, client);
  },
};
