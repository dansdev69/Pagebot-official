module.exports = {
  name: "balance",
  role: 1,
  description: "Show your economy game balance",
  usage: "balance",
  async run({ ECONOMY, senderId, sendMessage }) {
    const bal = ECONOMY[senderId]?.balance || 0;
    await sendMessage(`Your current balance is $${bal}`);
  },
};
