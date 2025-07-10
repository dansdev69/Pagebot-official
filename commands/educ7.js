module.exports = {
  name: "educ7",
  role: 1,
  description: "Educational fact #7",
  usage: "educ7",
  async run({ sendMessage }) {
    await sendMessage("Venus is the only planet that spins clockwise.");
  },
};