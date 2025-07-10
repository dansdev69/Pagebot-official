const fs = require('fs');
const path = require('path');

module.exports = {
  name: "help",
  role: 1,
  description: "Show all commands and their descriptions",
  usage: "help [command]",
  async run({ args, sendMessage }) {
    // Get a list of command files in the commands folder
    const commandsPath = path.join(__dirname);
    const files = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    // Dynamically require each command to get its metadata
    const commands = files.map(file => {
      const cmd = require(path.join(commandsPath, file));
      return {
        name: cmd.name,
        role: cmd.role,
        description: cmd.description,
        usage: cmd.usage || "",
      };
    });

    if (args[0]) {
      const cmd = commands.find(c => c.name === args[0].toLowerCase());
      if (cmd) {
        await sendMessage(
          `Command: ${cmd.name}\nDescription: ${cmd.description}\nUsage: ${cmd.usage}\nRole: ${cmd.role === 1 ? "All users" : "Admin only"}`
        );
      } else {
        await sendMessage("Command not found.");
      }
      return;
    }

    // Default: list all commands
    let msg = "Commands:\n";
    for (const c of commands) {
      msg += `- ${c.name} (${c.role === 1 ? "All" : "Admin"}): ${c.description}\n`;
    }
    await sendMessage(msg.trim());
  },
};