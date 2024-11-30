const mongoose=require("mongoose");

const UserDetailsSchema =new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['individual', 'admin', 'organization'], default: 'user' },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LocationInfo",
        required: function () {
            return this.role !== 'admin';
        },
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: function () {
            return this.role !== 'admin';
        }
    }
},{
    collection:"UserInfo"
});

UserDetailsSchema.pre('save', function(next) {
    if (this.role === 'admin') {
      this.isVerified = true; // Admins are always verified
    }
    next();
  });
mongoose.model("UserInfo", UserDetailsSchema);