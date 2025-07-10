module.exports = {
  name: "deposit",
  role: 1,
  description: "Deposit coins into your bank",
  usage: "deposit [amount]",
  async run({ ECONOMY, senderId, args, sendMessage }) {
    const amt = parseInt(args[0]);
    if (isNaN(amt) || amt <= 0) return sendMessage("Enter a valid amount.");
    if (ECONOMY[senderId].balance < amt) return sendMessage("Not enough balance.");
    ECONOMY[senderId].balance -= amt;
    ECONOMY[senderId].bank += amt;
    await sendMessage(`Deposited $${amt}. New bank: $${ECONOMY[senderId].bank}`);
  },
};