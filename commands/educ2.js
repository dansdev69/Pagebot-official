module.exports = {
  name: "educ2",
  role: 1,
  description: "Educational fact #2",
  usage: "educ2",
  async run({ sendMessage }) {
    await sendMessage("Honey never spoils. Archaeologists have found edible honey in ancient tombs.");
  },
};