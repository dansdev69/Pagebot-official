module.exports = {
  name: "payday",
  role: 1,
  description: "Get a payday bonus",
  usage: "payday",
  async run({ ECONOMY, senderId, sendMessage }) {
    const amt = Math.floor(Math.random() * 300) + 100;
    ECONOMY[senderId].balance += amt;
    await sendMessage(`Payday! You received $${amt}.`);
  },
};