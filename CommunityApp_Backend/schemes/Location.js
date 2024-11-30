const mongoose = require("mongoose");

const LocationDetails = new mongoose.Schema(
  {
    name: String,
    city: String,
    country: String,
    postcode: { type: String, unique: true },
  },
  {
    collection: "LocationInfo",
  }
);
mongoose.model("LocationInfo", LocationDetails);
