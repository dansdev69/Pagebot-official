module.exports = {
  name: "educ6",
  role: 1,
  description: "Educational fact #6",
  usage: "educ6",
  async run({ sendMessage }) {
    await sendMessage("The longest English word is 189,819 letters long.");
  },
};