const mongoose = require("mongoose");

const TestDriveUsersSchema = mongoose.Schema({
  model: { type: String, required: true },
  city: { type: String, required: true },
  name: { type: String, required: true },
  telephone: { type: String, required: true },
  created_at: { type: String, required: true },
  hours: { type: String, required: true },
});

const TestDriveUsers = mongoose.model("TestDriveUser", TestDriveUsersSchema);

module.exports = TestDriveUsers;
