const mongoose = require("mongoose");

const PdfModelSchema = mongoose.Schema({
  pdf: { type: String, required: true },
  selected_model: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const PdfModel = mongoose.model("ModelInnerPdf", PdfModelSchema);

module.exports = PdfModel;
