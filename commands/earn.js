module.exports = {
  name: "earn",
  role: 1,
  description: "Earn random coins",
  usage: "earn",
  async run({ ECONOMY, senderId, sendMessage }) {
    const amt = Math.floor(Math.random() * 100) + 10;
    ECONOMY[senderId].balance += amt;
    await sendMessage(`You earned $${amt}! Current balance: $${ECONOMY[senderId].balance}`);
  },
};