module.exports = {
  name: "feedback",
  role: 1,
  description: "Send feedback to admin",
  usage: "feedback [your message]",
  async run({ args, senderId, USERS, FEEDBACK, sendMessage }) {
    const msg = args.join(" ");
    if (!msg) return sendMessage("Please provide feedback.");
    FEEDBACK.push(`[${USERS[senderId]?.name || senderId}]: ${msg}`);
    await sendMessage("Feedback sent to admins.");
  },
};