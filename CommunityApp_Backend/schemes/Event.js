const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: "LocationInfo" },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo" }, // References the organization
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserInfo" }], // List of participants
  status: { type: String, enum: ["Upcoming", "Completed"], default: "Upcoming" },
});

mongoose.model("Event", eventSchema);
