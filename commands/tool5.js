module.exports = {
  name: "tool5",
  role: 1,
  description: "Useful tool #5: Greet",
  usage: "tool5",
  async run({ USERS, senderId, sendMessage }) {
    await sendMessage("Hello, " + (USERS[senderId]?.name || senderId) + "!");
  },
};