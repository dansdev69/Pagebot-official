module.exports = {
  name: "top",
  role: 1,
  description: "See the richest users",
  usage: "top",
  async run({ ECONOMY, USERS, sendMessage }) {
    const sorted = Object.entries(ECONOMY)
      .sort((a, b) => (b[1].balance + b[1].bank) - (a[1].balance + a[1].bank))
      .slice(0, 5)
      .map(([id, econ], i) => `${i + 1}. ${USERS[id]?.name || id}: $${econ.balance + econ.bank}`);
    await sendMessage(`Top users:\n${sorted.join("\n")}`);
  },
};