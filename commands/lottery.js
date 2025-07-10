module.exports = {
  name: "lottery",
  role: 1,
  description: "Play the lottery for a chance to win big!",
  usage: "lottery",
  async run({ ECONOMY, senderId, sendMessage }) {
    const win = Math.random() < 0.05;
    if (win) {
      ECONOMY[senderId].balance += 1000;
      await sendMessage("You hit the jackpot! +$1000");
    } else {
      await sendMessage("No luck this time!");
    }
  },
};