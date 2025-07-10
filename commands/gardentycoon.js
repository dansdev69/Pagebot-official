module.exports = {
  name: "gardentycoon",
  role: 1,
  description: "🌱 Become a Garden Tycoon! Grow, upgrade, and earn from your legendary garden.",
  usage: "gardentycoon [plant|water|harvest|upgrade|status]",
  async run({ ECONOMY, senderId, args, sendMessage }) {
    // Initialize user garden if not exists
    if (!ECONOMY[senderId].garden) {
      ECONOMY[senderId].garden = {
        plants: 0,
        level: 1,
        waterings: 0,
        lastHarvest: 0,
        legend: false,
      };
    }
    const garden = ECONOMY[senderId].garden;
    const subcommand = (args[0] || "status").toLowerCase();

    // Plant new seed
    if (subcommand === "plant") {
      if (ECONOMY[senderId].balance < 100) {
        return sendMessage("You need $100 to plant a new legendary seed!");
      }
      ECONOMY[senderId].balance -= 100;
      garden.plants += 1;
      garden.legend = false;
      return sendMessage(`🌱 You planted a legendary seed! You now have ${garden.plants} plant(s).`);
    }

    // Water plants
    if (subcommand === "water") {
      if (garden.plants === 0) return sendMessage("You don't have any plants to water.");
      garden.waterings += 1;
      return sendMessage(`💧 You watered your garden! Total waterings: ${garden.waterings}`);
    }

    // Harvest plants
    if (subcommand === "harvest") {
      const now = Date.now();
      if (garden.plants === 0) return sendMessage("Nothing to harvest. Plant some seeds first!");
      if (now - garden.lastHarvest < 60 * 60 * 1000) {
        // 1 hour cooldown
        return sendMessage("⏳ Your legendary plants need more time to grow. Try harvesting in a bit!");
      }
      // Calculate reward
      const baseReward = garden.plants * 150 * garden.level;
      const waterBonus = Math.floor(garden.waterings * 10 * garden.level);
      let legendBonus = 0;
      if (!garden.legend && Math.random() < 0.05) {
        legendBonus = 10000;
        garden.legend = true;
      }
      ECONOMY[senderId].balance += baseReward + waterBonus + legendBonus;
      garden.lastHarvest = now;
      garden.waterings = 0;
      let msg = `🌻 You harvested ${garden.plants} plant(s) and earned $${baseReward + waterBonus}`;
      if (legendBonus) msg += `\n🌟 LEGENDARY! You found a Golden Sunflower and earned a bonus $${legendBonus}!`;
      sendMessage(msg);
      return;
    }

    // Upgrade garden
    if (subcommand === "upgrade") {
      const upgradeCost = garden.level * 1000;
      if (ECONOMY[senderId].balance < upgradeCost) {
        return sendMessage(`You need $${upgradeCost} to upgrade your garden to level ${garden.level + 1}.`);
      }
      ECONOMY[senderId].balance -= upgradeCost;
      garden.level += 1;
      return sendMessage(`🏡 Your garden is now level ${garden.level}! Plant yields and bonuses increased.`);
    }

    // Show garden status (default)
    const legendText = garden.legend
      ? "🌟 Legendary plant found! Next harvest could be even more epic."
      : "No legendary plant... yet!";
    return sendMessage(
      `🌳 Garden Tycoon Status 🌳\n` +
      `Plants: ${garden.plants}\n` +
      `Garden Level: ${garden.level}\n` +
      `Pending Waterings: ${garden.waterings}\n` +
      `${legendText}\n` +
      `Commands: plant, water, harvest, upgrade, status\n` +
      `Type: gardentycoon [command]`
    );
  },
};