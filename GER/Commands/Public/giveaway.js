const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ApplicationCommandOptionType,
  ModalBuilder,
  PermissionsBitField,
  TextInputStyle,
} = require("discord.js");
const DB = require("../../Schemas/GiveawayDB");
const { endGiveaway } = require("../../Functions/GiveawayFunctions");

module.exports = {
  name: "giveaway",
  description: "Erstelle oder verwalte Gewinnspiele",
  defaultMemberPermissions: PermissionsBitField.Flags.ManageGuild,
  dmPermission: false,
  botPermissions: ["SendMessages"],
  options: [
    {
      name: "create",
      description: "Erstelle ein Gewinnspiel",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "manage",
      description: "Verwalte dein Gewinnspiel",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "toggle",
          description: "Was willst du mit deinem Gewinnspiel machen?",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: "Beenden", value: "end" },
            { name: "Pausieren", value: "pause" },
            { name: "Entpausieren", value: "unpause" },
            { name: "Reroll", value: "reroll" },
            { name: "Löschen", value: "delete" },
          ],
        },
        {
          name: "message_id",
          description: "Gib die Nachrichten-ID des Gewinnspiels an.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "create":
        {
          const prize = new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("giveaway-prize")
              .setLabel("Preis?")
              .setStyle(TextInputStyle.Short)
              .setMaxLength(256)
              .setRequired(true)
          );

          const winners = new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("giveaway-winners")
              .setLabel("Wie viele Gewinner?")
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          );

          const duration = new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("giveaway-duration")
              .setLabel("Länge?")
              .setStyle(TextInputStyle.Short)
              .setPlaceholder("Beispiel: 1 day, 1 hour, 1 minute")
              .setRequired(true)
          );

          const modal = new ModalBuilder()
            .setCustomId("giveaway-options")
            .setTitle("Erstelle ein Gewinnspiel")
            .setComponents(prize, winners, duration);

          await interaction.showModal(modal);
        }
        break;

      case "manage":
        {
          const embed = new EmbedBuilder();
          const messageId = interaction.options.getString("message_id");
          const toggle = interaction.options.getString("toggle");

          const data = await DB.findOne({
            GuildID: interaction.guild.id,
            MessageID: messageId,
          });
          if (!data) {
            embed
              .setColor("Red")
              .setDescription(
                "Ich konnte kein Gewinnspiel mit dieser ID finden."
              );
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }

          const message = await interaction.guild.channels.cache
            .get(data.ChannelID)
            .messages.fetch(messageId);
          if (!message) {
            embed.setColor("Red").setDescription("This giveaway doesn't exist");
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }

          if (["end", "reroll"].includes(toggle)) {
            if (data.Ended === (toggle === "end" ? true : false)) {
              embed
                .setColor("Red")
                .setDescription(
                  `Das Gewinnspiel ${
                    toggle === "end"
                      ? "ist schon beendet"
                      : "ist noch nicht beendet"
                  }`
                );
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (data.Paused === (toggle === "end" ? true : false)) {
              embed
                .setColor("Red")
                .setDescription(
                  "This giveaway is paused. Unpause it before ending the giveaway"
                );
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            endGiveaway(message, toggle === "end" ? false : true);

            embed
              .setColor("Green")
              .setDescription(
                `The giveaway has ${
                  toggle === "end" ? "ended" : "been rerolled"
                }`
              );
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }

          if (["pause", "unpause"].includes(toggle)) {
            if (data.Ended) {
              embed
                .setColor("Red")
                .setDescription("This giveaway has already ended");
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (data.Paused === (toggle === "pause" ? true : false)) {
              embed
                .setColor("Red")
                .setDescription(
                  `Das Gewinnspiel ist schon ${
                    toggle === "pause" ? "pausiert" : "entpausiert"
                  }`
                );
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const button = ActionRowBuilder.from(
              message.components[0]
            ).setComponents(
              ButtonBuilder.from(
                message.components[0].components[0]
              ).setDisabled(true)
            );

            const giveawayEmbed = EmbedBuilder.from(message.embeds[0]).setColor(
              toggle === "pause" ? "Yellow" : "#156789"
            );

            await DB.findOneAndUpdate(
              {
                GuildID: interaction.guild.id,
                MessageID: message.id,
              },
              {
                Paused: toggle === "pause" ? true : false,
              }
            );

            await message.edit({
              content: `🎉 **Giveaway ${
                toggle === "pause" ? "Pausiert" : "Gestartet"
              }** 🎉`,
              embeds: [giveawayEmbed],
              components: [button],
            });

            embed
              .setColor("Green")
              .setDescription(
                `Das Giveaway  ${toggle === "pause" ? "paused" : "unpaused"}`
              );
            interaction.reply({ embeds: [embed], ephemeral: true });

            if (toggle === "unpause" && data.EndTime * 1000 < Date.now())
              endGiveaway(message);
          }

          if (toggle === "delete") {
            await DB.deleteOne({
              GuildID: interaction.guild.id,
              MessageID: message.id,
            });

            message.delete();
            embed
              .setColor("Green")
              .setDescription("Das Giveaway wurde erfolgreich gelöscht.");
            interaction.reply({ embeds: [embed], ephemeral: true });
          }
        }
        break;
    }
  },
};
