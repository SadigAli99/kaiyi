const mongoose = require("mongoose");

const KaiyiHistoryBottomSchema = mongoose.Schema({
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
  year: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const KaiyiHistoryBottom = mongoose.model("KaiyiHistoryBottom", KaiyiHistoryBottomSchema);

module.exports = KaiyiHistoryBottom;
