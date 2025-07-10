module.exports = {
  name: "tool1",
  role: 1,
  description: "Useful tool #1: Echo",
  usage: "tool1 [message]",
  async run({ args, sendMessage }) {
    await sendMessage("Echo: " + args.join(" "));
  },
};