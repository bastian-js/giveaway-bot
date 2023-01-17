const { ButtonInteraction, Client, EmbedBuilder } = require("discord.js");
const DB = require("../../Schemas/GiveawayDB");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== "giveaway-join") return;

    const embed = new EmbedBuilder();
    const data = await DB.findOne({
      GuildID: interaction.guild.id,
      ChannelID: interaction.channel.id,
      MessageID: interaction.message.id,
    });

    if (!data) {
      embed
        .setColor("Red")
        .setDescription("Es gibt dazu keine Daten in der Datenbank");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (data.Entered.includes(interaction.user.id)) {
      embed
        .setColor("Red")
        .setDescription("Du bist dem Gewinnspiel schon beigetreten");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (data.Paused === true) {
      embed.setColor("Red").setDescription("Das Giveaway ist pausiert.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (data.Ended === true) {
      embed
        .setColor("Red")
        .setDescription("Das Gewinnspiel ist schon beendet.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await DB.findOneAndUpdate(
      {
        GuildID: interaction.guild.id,
        ChannelID: interaction.channel.id,
        MessageID: interaction.message.id,
      },
      {
        $push: { Entered: interaction.user.id },
      }
    ).then(() => {
      embed
        .setColor("Green")
        .setDescription("Du bist dem Giveaway erfolgreich beigetreten.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    });
  },
};
