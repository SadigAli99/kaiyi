const mongoose = require("mongoose");

const ContactFeedbackSchema = mongoose.Schema({
  name: { type: String, required: true },
  telephone: { type: String, required: true },
  created_at: { type: String, required: true },
  hours: { type: String, required: true },
});

const ContactFeedback = mongoose.model("ContactFeedback", ContactFeedbackSchema);

module.exports = ContactFeedback;
