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
        "> **/giveaway create**\n> Erstelle ein neues Gewinnspiel\n\n> **/giveaway manage** [beenden, pausieren, unpausieren, reroll, löschen] [message_id]\n> Verwalte dein Gewinnspiel\n\n> **/help**\n> Zeigt diese Nachricht an."
      )
      .setColor("Green");

    interaction.reply({ embeds: [embed] });
  },
};
