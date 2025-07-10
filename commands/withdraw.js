module.exports = {
  name: "withdraw",
  role: 1,
  description: "Withdraw coins from your bank",
  usage: "withdraw [amount]",
  async run({ ECONOMY, senderId, args, sendMessage }) {
    const amt = parseInt(args[0]);
    if (isNaN(amt) || amt <= 0) return sendMessage("Enter a valid amount.");
    if (ECONOMY[senderId].bank < amt) return sendMessage("Not enough in bank.");
    ECONOMY[senderId].bank -= amt;
    ECONOMY[senderId].balance += amt;
    await sendMessage(`Withdrew $${amt}. New balance: $${ECONOMY[senderId].balance}`);
  },
};