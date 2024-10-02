const mongoose = require("mongoose");

const TrafficRulesCallSchema = mongoose.Schema({
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  description: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  miniTitle: {
    az: { type: String, required: false, default: "" },
    en: { type: String, required: false, default: "" },
    ru: { type: String, required: false, default: "" },
  },
  telephone: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const TrafficRulesCall = mongoose.model("TrafficRulesCall", TrafficRulesCallSchema);

module.exports = TrafficRulesCall;
