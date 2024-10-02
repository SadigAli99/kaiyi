const mongoose = require("mongoose");

const VideoTabModelSchema = mongoose.Schema({
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  video: { type: String, required: true },
  selected_model: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const VideoTabModel = mongoose.model("ModelsVideoTab", VideoTabModelSchema);

module.exports = VideoTabModel;
