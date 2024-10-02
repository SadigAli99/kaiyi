const mongoose = require("mongoose");

const BecomeDealerModelSchema = mongoose.Schema({
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  image: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const BecomeDealerModel = mongoose.model("BecomeDealer", BecomeDealerModelSchema);

module.exports = BecomeDealerModel;
