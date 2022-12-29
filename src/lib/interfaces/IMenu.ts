import { ContextMenuCommandBuilder, ContextMenuCommandInteraction } from 'discord.js'

export interface IMenu {
    name: string
    data: ContextMenuCommandBuilder
    guildId?: string | undefined
    interactor: (interaction: ContextMenuCommandInteraction) => Promise<void>
}