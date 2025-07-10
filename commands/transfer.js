module.exports = {
  name: "transfer",
  role: 1,
  description: "Transfer coins to another user",
  usage: "transfer [userId] [amount]",
  async run({ ECONOMY, senderId, args, sendMessage }) {
    const [to, amount] = args;
    if (!to || isNaN(amount)) return sendMessage("Usage: transfer [userId] [amount]");
    if (!ECONOMY[to]) return sendMessage("User not found.");
    const amt = parseInt(amount);
    if (ECONOMY[senderId].balance < amt) return sendMessage("Not enough balance.");
    ECONOMY[senderId].balance -= amt;
    ECONOMY[to].balance += amt;
    await sendMessage(`Transferred $${amt} to user ${to}.`);
  },
};