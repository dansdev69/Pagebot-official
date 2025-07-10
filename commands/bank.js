module.exports = {
  name: "bank",
  role: 1,
  description: "Show your bank balance",
  usage: "bank",
  async run({ ECONOMY, senderId, sendMessage }) {
    const bank = ECONOMY[senderId]?.bank || 0;
    await sendMessage(`Your bank balance is $${bank}`);
  },
};