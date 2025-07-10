module.exports = {
  name: "daily",
  role: 1,
  description: "Collect your daily reward",
  usage: "daily",
  lastClaim: {},
  async run({ senderId, ECONOMY, sendMessage }) {
    const now = Date.now();
    if (this.lastClaim[senderId] && now - this.lastClaim[senderId] < 24 * 60 * 60 * 1000) {
      return sendMessage("You've already claimed your daily reward today!");
    }
    this.lastClaim[senderId] = now;
    ECONOMY[senderId].balance += 500;
    await sendMessage("You received your daily reward: $500!");
  },
};