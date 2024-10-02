const mongoose = require("mongoose");

const KaiyiHistoryNewsSchema = mongoose.Schema({
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
  created_at: { type: String, required: true },
  hours: { type: String, required: true },
  slug: {
    az: { type: String, unique: true, required: true },
    en: { type: String, unique: true, required: true },
    ru: { type: String, unique: true, required: true },
  },
  slogan: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  image: { type: String, required: false, default: "" },
  video: { type: String, required: false, default: "" },
  status: { type: String, required: false, default: "active" },
});

const KaiyiHistoryNews = mongoose.model("KaiyiHistoryNews", KaiyiHistoryNewsSchema);

module.exports = KaiyiHistoryNews;
