const mongoose = require("mongoose");

const TrafficRulesBottomSchema = mongoose.Schema({
  description: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  image: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const TrafficRulesBottom = mongoose.model("TrafficRulesBottom", TrafficRulesBottomSchema);

module.exports = TrafficRulesBottom;
