const mongoose = require("mongoose");

const ComfortTabModelSchema = mongoose.Schema({
  image: { type: String, required: true },
  selected_model: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const ComfortTabModel = mongoose.model("ModelsComfortTab", ComfortTabModelSchema);

module.exports = ComfortTabModel;
