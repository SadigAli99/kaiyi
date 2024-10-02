const mongoose = require("mongoose");

const ContactManagerSchema = mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  telephone: { type: String, required: true },
  created_at: { type: String, required: true },
  hours: { type: String, required: true },
});

const ContactManager = mongoose.model("ContactManagerUser", ContactManagerSchema);

module.exports = ContactManager;
