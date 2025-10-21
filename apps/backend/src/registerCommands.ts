// Register slash commands for the bot
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your external IDs and get your role!'),
  new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Create a support ticket')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

async function main() {
  if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_GUILD_ID) {
    throw new Error('Missing DISCORD_CLIENT_ID or DISCORD_GUILD_ID in env');
  }
  await rest.put(
    Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
    { body: commands }
  );
  console.log('Slash commands registered!');
}

main().catch(console.error);
