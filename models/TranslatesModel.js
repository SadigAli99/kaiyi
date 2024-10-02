const mongoose = require("mongoose");

const TranslatesSchema = mongoose.Schema({
  key: { type: String, required: true },
  azTitle: { type: String, required: true },
  enTitle: { type: String, required: true },
  ruTitle: { type: String, required: true },
});

const TranslatesModel = mongoose.model("Translate", TranslatesSchema);

module.exports = TranslatesModel;
