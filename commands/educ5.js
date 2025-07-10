module.exports = {
  name: "educ5",
  role: 1,
  description: "Educational fact #5",
  usage: "educ5",
  async run({ sendMessage }) {
    await sendMessage("Cats have fewer toes on their back paws.");
  },
};