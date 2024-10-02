const mongoose = require("mongoose");


const RepairRulesDownloadSchema = mongoose.Schema({
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  pdfs: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, required: false, default: "active" },
});

const RepairRulesDownload = mongoose.model("RepairRulesDownload", RepairRulesDownloadSchema);

module.exports = RepairRulesDownload;
