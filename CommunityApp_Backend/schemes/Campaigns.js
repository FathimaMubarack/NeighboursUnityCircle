const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requestedGoods: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      fulfilledQuantity: { type: Number, default: 0 }, 
    }
  ],
  imageURL: String,
  status: { type: String, enum: ["Open", "Completed"], default: "Open" },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo", required: true },
  donations: [
    {
      donorId: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo" },
      goods: [
        { name: { type: String }, quantity: { type: Number } }
      ],
    }
  ],
  locationId: { type: String }
}, { timestamps: true });

mongoose.model('Campaign', CampaignSchema);
