module.exports = {
  name: "gamble",
  role: 1,
  description: "Gamble your coins for a chance to double them",
  usage: "gamble [amount]",
  async run({ ECONOMY, senderId, args, sendMessage }) {
    const amt = parseInt(args[0]);
    if (isNaN(amt) || amt <= 0) return sendMessage("Enter a valid amount.");
    if (ECONOMY[senderId].balance < amt) return sendMessage("Not enough balance.");
    if (Math.random() < 0.5) {
      ECONOMY[senderId].balance -= amt;
      await sendMessage("You lost the gamble!");
    } else {
      ECONOMY[senderId].balance += amt;
      await sendMessage("You won the gamble! +" + amt);
    }
  },
};