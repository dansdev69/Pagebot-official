module.exports = {
  name: "shop",
  role: 1,
  description: "Show items in the shop",
  usage: "shop",
  async run({ sendMessage }) {
    await sendMessage("Shop:\n- Lucky Coin ($100)\n- VIP Pass ($500)");
  },
};