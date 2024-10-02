const mongoose = require("mongoose");

const TrafficRulesHelpedSchema = mongoose.Schema({
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  image: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const TrafficRulesHelped = mongoose.model("TrafficRulesHelped", TrafficRulesHelpedSchema);

module.exports = TrafficRulesHelped;
