const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  description: "Need help?",
  dmPermission: false,
  botPermissions: ["SendMessages"],

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Giveaway Bot | Help")
      .setDescription(
        "> **/giveaway create**\n> Creates a new giveaway\n\n> **/giveaway manage** [end, pause, unpause, reroll, delete] [message_id]\n> Manage your giveaways\n\n> **/help**\n> Shows this embed"
      )
      .setColor("Green");

    interaction.reply({ embeds: [embed] });
  },
};
