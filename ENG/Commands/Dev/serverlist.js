const {
  ChatInputCommandInteraction,
  PermissionsBitField,
  EmbedBuilder,
  Client,
  Guild
} = require("discord.js");

module.exports = {
  name: "serverlist",
  description: "Serverlist",
  developer: true,
  defaultMemberPermissions: PermissionsBitField.Flags.Administrator,
  dmPermission: false,
  botPermissions: ["SendMessages"],

  /**
   *
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, member, client } = interaction;

    const serverlist = new EmbedBuilder().setColor("Green").setDescription(`${client.guilds.cache.size}`);

    interaction.reply({ embeds: [serverlist], ephemeral: true });
  },
};
