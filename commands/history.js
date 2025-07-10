module.exports = {
  name: "history",
  role: 1,
  description: "Show your transaction history (stub)",
  usage: "history",
  async run({ sendMessage }) {
    await sendMessage("Transaction history feature coming soon!");
  },
};