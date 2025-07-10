module.exports = {
  name: "sendnoti",
  role: 2,
  description: "Send a notification to all users",
  usage: "sendnoti [message]",
  async run({ args, broadcast, sendMessage }) {
    const msg = args.join(" ");
    if (!msg) return sendMessage("Please provide a message.");
    await broadcast(`[Admin Notification]: ${msg}`);
    await sendMessage("Notification sent to all users.");
  },
};