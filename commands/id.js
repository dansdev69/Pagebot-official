module.exports = {
  name: "id",
  role: 1,
  description: "Show your user ID",
  usage: "id",
  async run({ senderId, sendMessage }) {
    await sendMessage(`Your user ID: ${senderId}`);
  },
};