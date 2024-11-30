const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const Complaints = require("./schemes/Complaints");
require('dotenv').config();

app.use(express.json({ limit: "5mb" }));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "5mb",
    extended: true,
    parameterLimit: 140000,
  })
);

const mongoUrl = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
  });
require("./schemes/UserDetails");
const User = mongoose.model("UserInfo");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

// Register API
app.post("/register", async (req, res) => {
  const { name, email, password, locationId, role } = req.body;
  
  if (role !== 'admin') {
    if (!locationId) {
      return res.status(400).send({ data: "Location is required!!" });
    }
  }
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res.send({ data: "User already exists!!" });
  }
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({
      name: name,
      email: email,
      password: encryptedPassword,
      location: locationId,
      role: role,
    });
    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

// Login API
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (!oldUser) {
    return res.send({ data: "User doesn't exist!!" });
  }
  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign(
      {
        email: oldUser.email,
        _id: oldUser._id,
        locationId: oldUser.location,
        verifyStatus: oldUser.isVerified,
        role: oldUser.role,
      },
      JWT_SECRET
    );
    if (res.status(201)) {
      return res.send({
        status: "ok",
        data: token,
        isVerified: oldUser.isVerified,
        role:  oldUser.role,
      });
    } else {
      return res.send({ error: "error" });
    }
  }
});

// User data retrieval API
app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;

    User.findOne({ email: useremail }).then((data) => {
      return res.send({ status: "Ok", data: data });
    });
  } catch (error) {
    return res.send({ error: "error" });
  }
});

// Create Posts
app.post("/create-complaint", async (req, res) => {
  const { token } = req.body;
  const { content } = req.body;
  let { image } = req.body;
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userEmail = decodedToken.email;
    const userId = decodedToken._id;
    const locationsId = decodedToken.locationId;
    console.log("Decoded User Id", userId);

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!content && image) {
      return res
        .status(400)
        .json({ error: "Complaint must have a text and image" });
    }

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      image = uploadedResponse.secure_url;
    }

    require("./schemes/Complaints");
    const newComplaint = new Complaints({
      user: userId,
      content,
      image,
      location: locationsId,
    });

    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in Create Complaint", error);
  }
});

app.post("/getAllComplaints", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ error: "Authorization token is  required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const usersLocationId = decoded.locationId;

    if(!usersLocationId) {
      return res.status(400).json({ error: "Location not found in token" });
    }
    const complaints = await Complaints.find({ location: usersLocationId })
      .sort({ createdAt: -1 })
      .populate({ path: "user" });

    if (complaints.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(complaints);
  } catch (error) {
    console.log("Error in getAllComplaints", error);
    res.status(500).json({ error: "Internal Server error" });
  }
});


require("./schemes/Location");
const Area = mongoose.model("LocationInfo");
// Create new Area
app.post("/new-area", async (req, res) => {
  const { name, city, country, postcode } = req.body;

  const oldArea = await Area.findOne({ postcode: postcode });

  if (oldArea) {
    return res.send({ data: "Area already exists" });
  }

  try {
    await Area.create({
      name: name,
      city: city,
      country: country,
      postcode: postcode,
    });
    res.send({ status: "ok", data: "New Area Created" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

// Fetch Location names and IDs
app.get("/getLocations", async (req, res) => {
  try {
    const locations = await Area.find();
    if (locations.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(locations);
  } catch (error) {
    console.log("Error in getLocations", error);
    res.status(500).json({ error: "Internal Server error" });
  }
});

require("./schemes/userVerification");
const newVerify = mongoose.model("VerificationInfo");

// New User Verify
app.post("/VerificationDetails", async (req, res) => {
  const { token, address } = req.body;
  let { imageUrl } = req.body;
  try {
    const tokenDecoded = jwt.verify(token, JWT_SECRET);
    const userId = tokenDecoded._id;
    const usersEmail = tokenDecoded.email;
    const locationsId = tokenDecoded.locationId;

    const user = await User.findOne({ email: usersEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!token && imageUrl && address) {
      return res
        .status(400)
        .json({ error: "Provide provide required Details" });
    }

    if (imageUrl) {
      const uploadedImage = await cloudinary.uploader.upload(imageUrl);
      imageUrl = uploadedImage.secure_url;
    }

    const newVerification = new newVerify({
      userId: userId,
      imageUrl: imageUrl,
      address,
      locationsId,
    });

    await newVerification.save();
    res.status(201).json(newVerification);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in Verifying Details", error);
  }
});


app.get("/pendingOrganizations", async (req, res) => {
  try {
    const pendingOrganizations = await User.find({ role: "organization", isVerified: false });
    res.send({ status: "ok", data: pendingOrganizations });
  } catch (error) {
    console.error("Error fetching pending organizations:", error);
    res.send({ status: "error", data: error.message });
  }
});


//Approve Organization
app.post("/approveOrganization", async (req, res) => {
  const { userId } = req.body;
  console.log("Request recieved with userId", userId);
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ status: "error", data: "User not found" });
    }

    if (user.role !== "organization") {
      return res.status(400).send({
        status: "error",
        data: "Only organizations can be approved",
      });
    }
    user.isVerified = true;
    await user.save();
    res.send({
      status: "ok",
      data: "Organization approved and verified successfully",
    });
  } catch (error) {
    console.error("Error approving organization:", error);
    res.status(500).send({ status: "error", data: "Something went wrong" });
  }
});

require("./schemes/Campaigns");
const Campaign = mongoose.model("Campaign");
// Create New Campaigns
app.post("/createCampaign", async (req,res) => {
    try {
      const { token, title, description, requestedGoods, imageURL } = req.body;
      const decodeToken = jwt.verify(token, JWT_SECRET);
      const organizationsId = decodeToken._id;
      const locationsId = decodeToken.locationId;
  
      if (decodeToken.role !== "organization") {
        return res.status(403).json({ error: "Access denied" });
      }

      let uploadedImageURL = imageURL;

      if (imageURL) {
        const uploadResponse = await cloudinary.uploader.upload(imageURL);
        uploadedImageURL = uploadResponse.secure_url;
      }
  
      const newCampaign = new Campaign({
        title,
        description,
        requestedGoods,
        imageURL: uploadedImageURL,
        organizationId: organizationsId,
        locationId: locationsId,
      });
  
      await newCampaign.save();
      res.status(201).json({ message: "Campaign created successfully", newCampaign });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

//Get Active Campaigns
app.post("/getActiveCampaigns", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ error: "Authorization token is  required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userLocationId = decoded.locationId;

    if(!userLocationId) {
      return res.status(400).json({ error: "Location not found in token" });
    }
    const campaigns = await Campaign.find({ status: "Open", locationId: userLocationId  });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in creating campaign", error);
  }
});

//Get an Organizations campaign
app.post("/getOrgCampaigns", async (req, res) => {
  try {
    const { token } = req.body;

    const decToken = jwt.verify(token, JWT_SECRET);
    const orgId = decToken._id;
  

    const campaign = await Campaign.find({ organizationId: orgId });
    res.status(200).json(campaign);
  } catch (error) {
    console.error("Error in /getOrgCampaigns:", error);
    res.status(500).json({ error: error.message });
  }
});


//Donate to campaign
app.post("/DonateToCampaign", async (req, res) => {
  try {
    const { token } = req.body;
    const { id } = req.body;
    const { goods } = req.body;
    const tokenDec = jwt.verify(token, JWT_SECRET);
    const donorsId = tokenDec._id; 
    const campaign = await Campaign.findById(id);
    if (!campaign || campaign.status !== "Open" || campaign.organizationId !== donorsId) {
      return res.status(404).json({ error: "Campaign not found or closed" });
    }

    goods.forEach((item) => {
      const good = campaign.requestedGoods.find(g => g.name === item.name);
      if (good) {
        good.fulfilledQuantity += item.quantity;
      }
    });
    campaign.donations.push({
      donorId: donorsId,
      goods,
    });
    await campaign.save();
    res.status(200).json({ message: "Donation successful", campaign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/updateCampaignGoods", async (req, res) => {
  try {
    const { campaignId, requestedGoods } = req.body;
    if (!campaignId || !requestedGoods) {
      return res.status(400).json({ error: "Campaign ID and requested goods are required" });
    }

    // Find the campaign by ID
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    campaign.requestedGoods = requestedGoods;
    await campaign.save();

    res.status(200).json({ success: true, message: "Campaign goods updated successfully!" });
  } catch (error) {
    console.error("Error updating campaign goods:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/getCampaignGoods", async (req, res) => {
  try {
    const { campaignId } = req.body;
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

require("./schemes/Event");
const Event = mongoose.model("Event");
app.post("/createEvent", async (req, res) => {
  try {
    const { title, description, date, token } = req.body;
    
    if (!title || !date || !token) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Verify the user's token and check if it's an organization
    const decoded = jwt.verify(token, JWT_SECRET);
    const eventLocation = decoded.locationId;
    const organizId = decoded._id;
    if (decoded.role !== "organization") {
      return res.status(403).json({ error: "Only organizations can create events." });
    }

    // Create the event
    const newEvent = new Event({
      title,
      description,
      date,
      location: eventLocation,
      organizerId: organizId,
      participants: [],
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully!", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/getEvents", async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded._id;
    const userRole = decoded.role;

    let events;

    if (userRole === "individual") {
      events = await Event.find({ status: "Upcoming" });
    } else {
      events = await Event.find({ organizerId: userId });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/joinEvent", async (req, res) => {
  try {
    const { eventId, token } = req.body;

    if (!eventId || !token) {
      return res.status(400).json({ error: "Event ID and token are required." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    if (event.participants.includes(userId)) {
      return res.status(400).json({ error: "You are already a participant." });
    }

    event.participants.push(userId);
    await event.save();

    res.status(200).json({ message: "Successfully joined the event!", event });
  } catch (error) {
    console.error("Error joining event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/updateEventStatus", async (req, res) => {
  try {
    const { eventId, status, token } = req.body;

    if (!eventId || !status || !token) {
      return res.status(400).json({ error: "Event ID, status, and token are required." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "organization") {
      return res.status(403).json({ error: "Only organizations can update event status." });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    event.status = status;
    await event.save();

    res.status(200).json({ message: "Event status updated successfully!", event });
  } catch (error) {
    console.error("Error updating event status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




app.listen(5001, () => {
  console.log("Node js Server started running.");
});
