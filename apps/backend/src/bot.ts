// Discord bot entrypoint (MVP)
import { Client, GatewayIntentBits, Partials, Events, EmbedBuilder, PermissionsBitField } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

bot.once('ready', () => {
  console.log(`Logged in as ${bot.user?.tag}`);
});

// Command: /link (simulate linking all IDs)
bot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'link') {
    const roleId = process.env.DISCORD_LINKED_ROLE_ID;
    if (!roleId) return interaction.reply({ content: 'Role not configured.', ephemeral: true });
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    if (!member) return interaction.reply({ content: 'Member not found.', ephemeral: true });
    await member.roles.add(roleId);
    await interaction.reply({ content: 'All IDs linked! Role granted.', ephemeral: true });
    const logChannelId = process.env.DISCORD_LOG_CHANNEL_ID;
    if (logChannelId) {
      const logChannel = await interaction.guild?.channels.fetch(logChannelId);
      if (logChannel?.isTextBased()) {
        await logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle('User Linked All IDs')
              .setDescription(`<@${interaction.user.id}> linked all IDs and was granted the role.`)
              .setColor(0xFF4500)
          ]
        });
      }
    }
  }
});

// Listen for a slash command to create a ticket (skeleton)
bot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'ticket') {
    // TODO: Show modal for category/priority/summary
    await interaction.reply({ content: 'Ticket creation coming soon!', ephemeral: true });
  }
});

// Listen for a custom event to assign a role after linking (to be called from API)
export async function assignLinkedRole(discordUserId: string) {
  const guild = bot.guilds.cache.get(process.env.DISCORD_GUILD_ID!);
  if (!guild) return;
  const member = await guild.members.fetch(discordUserId).catch(() => null);
  if (!member) return;
  const roleId = process.env.DISCORD_LINKED_ROLE_ID!;
  if (!roleId) return;
  if (!member.roles.cache.has(roleId)) {
    await member.roles.add(roleId).catch(() => {});
  }
}

// Login once if token is available
if (process.env.DISCORD_BOT_TOKEN) {
  bot.login(process.env.DISCORD_BOT_TOKEN).catch(err => console.error('Discord login failed:', err));
}

// Command: /ticket (create a ticket channel)
bot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'ticket') {
    const categoryId = process.env.DISCORD_TICKET_CATEGORY_ID;
    if (!categoryId) return interaction.reply({ content: 'Ticket category not configured.', ephemeral: true });
    const channelName = `ticket-${interaction.user.username}`;
    const channel = await interaction.guild?.channels.create({
      name: channelName,
      type: 0, // GUILD_TEXT
      parent: categoryId,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
        }
      ]
    });
    if (!channel) return interaction.reply({ content: 'Failed to create ticket.', ephemeral: true });
    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('Support Ticket')
          .setDescription(`Hello <@${interaction.user.id}>, a staff member will be with you soon!`)
          .setColor(0xFFD700)
      ]
    });
    await interaction.reply({ content: `Ticket created: <#${channel.id}>`, ephemeral: true });
  }
});

// Login once if token is available
if (process.env.DISCORD_BOT_TOKEN) {
  bot.login(process.env.DISCORD_BOT_TOKEN).catch(err => console.error('Discord login failed:', err));
}

export default bot;
