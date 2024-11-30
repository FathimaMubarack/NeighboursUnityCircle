const mongoose = require("mongoose");
const {
  fetchImageFromCloudinary,
} = require("../helpers/fetchImageFromCloudinary"); 
const { extractTextFromImage } = require("../helpers/extractTextFromImage"); 
require("./UserDetails");
const UserInfo = mongoose.model("UserInfo");
require("./Location");
const LocationInfo = mongoose.model("LocationInfo");
const Fuse = require("fuse.js");

const userVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserInfo",
      required: true,
    },
    imageUrl: String,
    address: String,
    isApproved: Boolean,
    locationsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LocationInfo",
      required: true,
    },
  },
  {
    collection: "VerificationInfo",
  }
);

userVerificationSchema.post("save", async function (doc) {
  console.log(
    "New verification record created, triggering verification process..."
  );

  try {
    if (doc.isProcessing) {
      console.log("Verification already processed, Skipping...");
      return;
    }

    doc.isProcessing = true;

    const { imageUrl, address, userId, locationsId } = doc;

    const location = await LocationInfo.findById(locationsId);
    const user = await UserInfo.findById(userId);
    if (!location) {
      console.log("Location not found!");
      return;
    }

    if (!user) {
      console.log("User Not Found");
      return;
    }

    
    const imageBuffer = await fetchImageFromCloudinary(imageUrl);


    const extractedText = await extractTextFromImage(imageBuffer);

    const normalizeText = (text) =>
      text.toLowerCase().replace(/\s+/g, " ").trim();

  
    let cleanExtractedText = extractedText
      .replace(/[^\w\s,-]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const cleanedExtractedText = normalizeText(extractedText);
    const normalizedAddress = normalizeText(address);
    const normalizedLocationName = normalizeText(location.name);
    const normalizedLocationCity = normalizeText(location.city);
    const normalizedUserName = normalizeText(user.name);

    // Initialize Fuse.js for fuzzy matching
    const fuseAddress = new Fuse([normalizedAddress], {
      includeScore: true,
      threshold: 0.6, 
      keys: ["address"], 
    });

    const fuseLocationName = new Fuse([normalizedLocationName], {
      includeScore: true,
      threshold: 0.3, 
      keys: ["name"], 
    });

    const fuseCity = new Fuse([normalizedLocationCity], {
      includeScore: true,
      threshold: 0.3, 
      keys: ["city"], 
    });

    const fuseUserName = new Fuse([normalizedUserName], {
      includeScore: true,
      threshold: 0.3, 
      keys: ["userName"], 
    });

    console.log("Extracted Text:", extractedText);
    console.log("Normalized Extracted Text:", cleanedExtractedText);
    console.log("Normalized Address:", normalizedAddress);
    console.log("Normalized Location Name:", normalizedLocationName);
    console.log("Normalized Location City:", normalizedLocationCity);
    console.log("Normalized User Name:", normalizedUserName);

    // Perform fuzzy matching
    const addressMatch = fuseAddress.search(normalizedAddress);
    const locationNameMatch = fuseLocationName.search(normalizedLocationName);
    const cityMatch = fuseCity.search(normalizedLocationCity);
    const userNameMatch = fuseUserName.search(normalizedUserName);

    // Log the matches
    console.log("Address Match:", addressMatch);
    console.log("Location Name Match:", locationNameMatch);
    console.log("City Match:", cityMatch);
    console.log("User Name Match:", userNameMatch);

    // // Check individual match scores
    // const addressMatchScore =
    //   addressMatch.length > 0 ? addressMatch[0].score : null;
    // const locationNameMatchScore =
    //   locationNameMatch.length > 0 ? locationNameMatch[0].score : null;
    // const cityMatchScore = cityMatch.length > 0 ? cityMatch[0].score : null;
    // const userNameMatchScore =
    //   userNameMatch.length > 0 ? userNameMatch[0].score : null;

    // console.log("Address Match Score:", addressMatchScore);
    // console.log("Location Name Match Score:", locationNameMatchScore);
    // console.log("City Match Score:", cityMatchScore);
    // console.log("User Name Match Score:", userNameMatchScore);

    // // Debug: Detect the mismatches
    // if (addressMatchScore && addressMatchScore > 0.4) {
    //   console.log(`Address mismatch detected with score: ${addressMatchScore}`);
    // }

    // if (locationNameMatchScore && locationNameMatchScore > 0.3) {
    //   console.log(
    //     `Location Name mismatch detected with score: ${locationNameMatchScore}`
    //   );
    // }

    // if (cityMatchScore && cityMatchScore > 0.3) {
    //   console.log(`City mismatch detected with score: ${cityMatchScore}`);
    // }

    // if (userNameMatchScore && userNameMatchScore > 0.3) {
    //   console.log(
    //     `User Name mismatch detected with score: ${userNameMatchScore}`
    //   );
    // }

    
    const isVerified =
      addressMatch.length > 0 &&
      addressMatch[0].score < 0.6 && 
      locationNameMatch.length > 0 &&
      locationNameMatch[0].score < 0.3 && 
      cityMatch.length > 0 &&
      cityMatch[0].score < 0.3 && 
      userNameMatch.length > 0 &&
      userNameMatch[0].score < 0.3;

    console.log("isVerified:", isVerified);

   
    doc.isApproved = isVerified;
    if (doc.isModified("isApproved")) {
      await doc.save();
    }


    if (user) {
      user.isVerified = isVerified; 
      await user.save();
    }

    console.log("Verification completed and saved.");
  } catch (error) {
    console.error("Error during verification process:", error.message);
  } finally {
    doc.isProcessing = false;
  }
});

mongoose.model("VerificationInfo", userVerificationSchema);
