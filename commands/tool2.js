module.exports = {
  name: "tool2",
  role: 1,
  description: "Useful tool #2: Reverse text",
  usage: "tool2 [message]",
  async run({ args, sendMessage }) {
    await sendMessage(args.join(" ").split("").reverse().join(""));
  },
};