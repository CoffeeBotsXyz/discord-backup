# @coffeebots/discord-backup

<div align="left">
    <a href="https://discord.gg/9tnbkzwyMD"> <img src="https://img.shields.io/discord/1217224916466929734?color=5865F2&logo=discord&logoColor=white" alt="discord"/> </a>
    <a href="https://www.npmjs.com/package/@coffeebots/discord-backup"> <img src="https://img.shields.io/npm/v/@coffeebots/discord-backup.svg?maxAge=3600" alt="npm version"/> </a>
    <a href="https://www.npmjs.com/package/@coffeebots/discord-backup"> <img src="https://img.shields.io/npm/dt/@coffeebots/discord-backup.svg?maxAge=3600" alt="npm downloads"/> </a>
</div>

@coffeebots/discord-backup is a powerful [Node.js](https://nodejs.org) module that allows you to easily manage discord server backups!

## Features

-   ⏱️ Easy to use!
-   🔥 Unlimited backups!
-   ⏱️ Backup creation takes less than 10 seconds!
-   ✨ Even restores messages with webhooks!
-   🚀 And restores everything that is possible to restore (channels, roles, permissions, bans, emojis, name, icon, and more!)

## Installation

```cli
npm install --save @coffeebots/discord-backup
```

## Examples

### Create

Create a backup for the server specified in the parameters!

```js
/**
 * @param {Guild} [Guild] - The discord server you want to backup
 * @param {object} [options] - The backup options
 */

const { create } = require("@coffeebots/discord-backup");
create(Guild, options).then((backupData) => {
    console.log(backupData.id); // NSJH2
});
```

Click [here](#create-advanced) to learn more about **backup options**.

### Load

Allows you to load a backup on a Discord server!

```js
/**
 * @param {string} [backupID] - The ID of the backup that you want to load
 * @param {Guild} [Guild] - The discord server on which you want to load the backup
 */

const { load, remove } = require("@coffeebots/discord-backup");
load(backupID, Guild).then(() => {
    remove(backupID); // When the backup is loaded, it's recommended to delete it
});
```

### Fetch

Fetches information from a backup

```js
/**
 * @param {string} [backupID] - The ID of the backup to fetch
 */

const { fetch } = require("@coffeebots/discord-backup");
fetch(backupID).then((backupInfos) => {
    console.log(backupInfos);
    /*
    {
        id: "BC5qo",
        size: 0.05
        data: {BackupData}
    }
    */
});
```

### Remove

**Warn**: once the backup is removed, it is impossible to recover it!

```js
/**
 * @param {string} [backupID] - The ID of the backup to remove
 */

const { remove } = require("@coffeebots/discord-backup");
remove(backupID);
```

### List

**Note**: `backup#list()` simply returns an array of IDs, you must fetch the ID to get complete information.

```js
const { list } = require("@coffeebots/discord-backup");
list().then((backups) => {
    console.log(backups); // Expected Output [ "BC5qo", "Jdo91", ...]
});
```

### SetStorageFolder

Updates the storage folder to another

```js
const { create, setStorageFolder } = require("@coffeebots/discord-backup");
setStorageFolder(__dirname+"/backups/");
await create(guild); // Backup created in ./backups/
```

## Advanced usage

### Create [advanced]

You can use more options for backup creation:

```js
const { create } = require("@coffeebots/discord-backup");
create(guild, {
    maxMessagesPerChannel: 10,
    jsonSave: false,
    jsonBeautify: true,
    doNotBackup: [ "roles",  "channels", "emojis", "bans" ],
    saveImages: "url"
});
```

**maxMessagesPerChannel**: Maximum of messages to save in each channel. "0" won't save any messages.  
**jsonSave**: Whether to save the backup into a json file. You will have to save the backup data in your own db to load it later.  
**jsonBeautify**: Whether you want your json backup pretty formatted.  
**doNotBackup**: Things you don't want to backup. Available items are: `roles`, `channels`, `emojis`, `bans`.  
**saveImages**: How to save images like guild icon and emojis. Set to "url" by default, restoration may not work if the old server is deleted. So, `url` is recommended if you want to clone a server (or if you need very light backups), and `base64` if you want to backup a server. Save images as base64 creates heavier backups.

### Load [advanced]

As you can see, you're able to load a backup from your own data instead of from an ID:

```js
const { load } = require("@coffeebots/discord-backup");
load(backupData, guild, {
    clearGuildBeforeRestore: true
});
```

**clearGuildBeforeRestore**: Whether to clear the guild (roles, channels, etc... will be deleted) before the backup restoration (recommended).  
**maxMessagesPerChannel**: Maximum of messages to restore in each channel. "0" won't restore any messages.

## Restored things

Here are all things that can be restored with `@coffeebots/discord-backup`:  

* Server icon  
* Server banner  
* Server region  
* Server splash  
* Server verification level  
* Server explicit content filter  
* Server default message notifications  
* Server embed channel  
* Server bans (with reasons)  
* Server emojis  
* Server AFK (channel and timeout)  
* Server channels (with permissions, type, nsfw, messages, etc...)  
* Server roles (with permissions, color, etc...)

### Example of things that can't be restored:

* Server logs  
* Server invitations  
* Server vanity url

## Support Us
If you find this project helpful and want to support our work, consider [supporting us](https://coffeebots.xyz/store). Your support helps us maintain and improve this project.