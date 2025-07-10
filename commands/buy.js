module.exports = {
  name: "buy",
  role: 1,
  description: "Buy items from the shop",
  usage: "buy [item]",
  async run({ ECONOMY, senderId, args, sendMessage }) {
    const item = args[0];
    if (!item) return sendMessage("Specify an item to buy.");
    if (item === "coin" && ECONOMY[senderId].balance >= 100) {
      ECONOMY[senderId].balance -= 100;
      await sendMessage("You bought a Lucky Coin!");
    } else if (item === "vip" && ECONOMY[senderId].balance >= 500) {
      ECONOMY[senderId].balance -= 500;
      await sendMessage("You bought a VIP Pass!");
    } else {
      await sendMessage("Not enough balance or invalid item.");
    }
  },
};