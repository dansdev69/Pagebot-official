module.exports = {
  name: "educ9",
  role: 1,
  description: "Educational fact #9",
  usage: "educ9",
  async run({ sendMessage }) {
    await sendMessage("There are more stars in the universe than grains of sand on Earth.");
  },
};