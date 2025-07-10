module.exports = {
  name: "setcoin",
  role: 2,
  description: "Set a user's economy game balance",
  usage: "setcoin [userId] [amount]",
  async run({ args, ECONOMY, sendMessage }) {
    const [id, amount] = args;
    if (!id || isNaN(amount)) return sendMessage("Usage: setcoin [userId] [amount]");
    if (!ECONOMY[id]) return sendMessage("User not found.");
    ECONOMY[id].balance = parseInt(amount);
    await sendMessage(`Set balance of user ${id} to ${amount}`);
  },
};