"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannels = exports.getEmojis = exports.getRoles = exports.getMembers = exports.getBans = void 0;
const discord_js_1 = require("discord.js");
const axios_1 = require("axios");
const util_1 = require("./util");
/**
 * Returns an array with the banned members of the guild
 * @param {Guild} guild The Discord guild
 * @returns {Promise<BanData[]>} The banned members
 */
async function getBans(guild) {
    const bans = [];
    const cases = await guild.bans.fetch(); // Gets the list of the banned members
    cases.forEach((ban) => {
        bans.push({
            id: ban.user.id, // Banned member ID
            reason: ban.reason // Ban reason
        });
    });
    return bans;
}
exports.getBans = getBans;
/**
 * Returns an array with the members of the guild
 * @param {Guild} guild The Discord guild
 * @returns {Promise<MemberData>}
 */
async function getMembers(guild) {
    const members = [];
    guild.members.cache.forEach((member) => {
        members.push({
            userId: member.user.id, // Member ID
            username: member.user.username, // Member username
            discriminator: member.user.discriminator, // Member discriminator
            avatarUrl: member.user.avatarURL(), // Member avatar URL
            joinedTimestamp: member.joinedTimestamp, // Member joined timestamp
            roles: member.roles.cache.map((role) => role.id), // Member roles
            bot: member.user.bot // Member bot
        });
    });
    return members;
}
exports.getMembers = getMembers;
/**
 * Returns an array with the roles of the guild
 * @param {Guild} guild The discord guild
 * @returns {Promise<RoleData[]>} The roles of the guild
 */
async function getRoles(guild) {
    const roles = [];
    guild.roles.cache
        .filter((role) => !role.managed)
        .sort((a, b) => b.position - a.position)
        .forEach((role) => {
        const roleData = {
            name: role.name,
            color: role.hexColor,
            hoist: role.hoist,
            permissions: role.permissions.bitfield.toString(),
            mentionable: role.mentionable,
            position: role.position,
            isEveryone: guild.id === role.id
        };
        roles.push(roleData);
    });
    return roles;
}
exports.getRoles = getRoles;
/**
 * Returns an array with the emojis of the guild
 * @param {Guild} guild The discord guild
 * @param {CreateOptions} options The backup options
 * @returns {Promise<EmojiData[]>} The emojis of the guild
 */
async function getEmojis(guild, options) {
    const emojis = [];
    guild.emojis.cache.forEach(async (emoji) => {
        const eData = {
            name: emoji.name
        };
        if (options.saveImages && options.saveImages === 'base64') {
            eData.base64 = (await axios_1.default.get(emoji.url).then((res) => res.data.buffer())).toString('base64');
        }
        else {
            eData.url = emoji.url;
        }
        emojis.push(eData);
    });
    return emojis;
}
exports.getEmojis = getEmojis;
/**
 * Returns an array with the channels of the guild
 * @param {Guild} guild The discord guild
 * @param {CreateOptions} options The backup options
 * @returns {ChannelData[]} The channels of the guild
 */
async function getChannels(guild, options) {
    return new Promise(async (resolve) => {
        const channels = {
            categories: [],
            others: []
        };
        // Gets the list of the categories and sort them by position
        const categories = guild.channels.cache
            .filter((ch) => ch.type === discord_js_1.ChannelType.GuildCategory)
            .sort((a, b) => a.position - b.position)
            .toJSON();
        for (const category of categories) {
            const categoryData = {
                name: category.name, // The name of the category
                permissions: (0, util_1.fetchChannelPermissions)(category), // The overwrite permissions of the category
                children: [] // The children channels of the category
            };
            // Gets the children channels of the category and sort them by position
            const children = category.children.cache.sort((a, b) => a.position - b.position).toJSON();
            for (const child of children) {
                // For each child channel
                if (child.type === discord_js_1.ChannelType.GuildText || child.type === discord_js_1.ChannelType.GuildNews) {
                    const channelData = await (0, util_1.fetchTextChannelData)(child, options); // Gets the channel data
                    categoryData.children.push(channelData); // And then push the child in the categoryData
                }
                else {
                    const channelData = await (0, util_1.fetchVoiceChannelData)(child); // Gets the channel data
                    categoryData.children.push(channelData); // And then push the child in the categoryData
                }
            }
            channels.categories.push(categoryData); // Update channels object
        }
        // Gets the list of the other channels (that are not in a category) and sort them by position
        const others = guild.channels.cache
            .filter((ch) => {
            return !ch.parent && ch.type !== discord_js_1.ChannelType.GuildCategory
                //&& ch.type !== 'GUILD_STORE' // there is no way to restore store channels, ignore them
                && ch.type !== discord_js_1.ChannelType.GuildNewsThread && ch.type !== discord_js_1.ChannelType.GuildPrivateThread && ch.type !== discord_js_1.ChannelType.GuildPublicThread; // threads will be saved with fetchTextChannelData
        })
            .sort((a, b) => a.position - b.position)
            .toJSON();
        for (const channel of others) {
            // For each channel
            if (channel.type === discord_js_1.ChannelType.GuildText || channel.type === discord_js_1.ChannelType.GuildNews) {
                const channelData = await (0, util_1.fetchTextChannelData)(channel, options); // Gets the channel data
                channels.others.push(channelData); // Update channels object
            }
            else {
                const channelData = await (0, util_1.fetchVoiceChannelData)(channel); // Gets the channel data
                channels.others.push(channelData); // Update channels object
            }
        }
        resolve(channels); // Returns the list of the channels
    });
}
exports.getChannels = getChannels;
