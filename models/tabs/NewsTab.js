const mongoose = require("mongoose");

const NewsTabSchema = mongoose.Schema({
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
  slogan: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  video: { type: String, required: false, default: "" },
  image: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const NewsTabModel = mongoose.model("NewsTab", NewsTabSchema);

module.exports = NewsTabModel;
