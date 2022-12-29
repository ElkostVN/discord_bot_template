import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export interface ICommand {
    name: string
    data: SlashCommandBuilder
    guildId?: string | undefined
    interactor: (interaction: ChatInputCommandInteraction) => Promise<void>
}