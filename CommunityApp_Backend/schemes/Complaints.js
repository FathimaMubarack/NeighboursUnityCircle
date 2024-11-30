const mongoose = require("mongoose");

const ComplaintsDetailsSchema = new mongoose.Schema(
  {
    content: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserInfo",
      required: true,
    },
    image: String,
    replies: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo" },
        content: { type: String, required: true },
      },
    ],
    location:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "LocationInfo",
      required: true,
    },
  },
  { timestamps: true }
);
const Complaints = mongoose.model("Complaints", ComplaintsDetailsSchema);

module.exports = Complaints;
