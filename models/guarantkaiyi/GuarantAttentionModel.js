const mongoose = require("mongoose");

const GuarantKaiyiAttentionSchema = mongoose.Schema({
  description: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  status: { type: String, required: false, default: "active" },
});

const GuarantKaiyiAttention = mongoose.model("GuarantKaiyiAttention", GuarantKaiyiAttentionSchema);

module.exports = GuarantKaiyiAttention;
