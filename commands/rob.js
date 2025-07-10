module.exports = {
  name: "rob",
  role: 1,
  description: "Attempt to rob another user",
  usage: "rob [userId]",
  async run({ ECONOMY, senderId, args, sendMessage }) {
    const victim = args[0];
    if (!victim || !ECONOMY[victim]) return sendMessage("User not found.");
    if (victim === senderId) return sendMessage("You can't rob yourself!");
    if (Math.random() < 0.3) {
      const amt = Math.floor(Math.random() * 200) + 50;
      ECONOMY[victim].balance = Math.max(0, ECONOMY[victim].balance - amt);
      ECONOMY[senderId].balance += amt;
      await sendMessage(`You robbed $${amt} from user ${victim}`);
    } else {
      await sendMessage("Robbery failed! You got nothing.");
    }
  },
};