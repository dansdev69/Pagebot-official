module.exports = {
  name: "invest",
  role: 1,
  description: "Invest coins for a chance to earn profit",
  usage: "invest [amount]",
  async run({ ECONOMY, senderId, args, sendMessage }) {
    const amt = parseInt(args[0]);
    if (isNaN(amt) || amt <= 0) return sendMessage("Enter a valid amount.");
    if (ECONOMY[senderId].balance < amt) return sendMessage("Not enough balance.");
    ECONOMY[senderId].balance -= amt;
    const profit = Math.random() < 0.5 ? amt * 2 : 0;
    ECONOMY[senderId].balance += profit;
    await sendMessage(profit ? `Investment succeeded! You now have $${ECONOMY[senderId].balance}` : "Investment failed. You lost your money.");
  },
};