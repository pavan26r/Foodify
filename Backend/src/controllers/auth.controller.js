const userModel = require('../models/user.model');
const foodPartnerModel = require('../models/foodpartner');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, id, cookieName) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie(cookieName, token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });
};
async function registerUser(req, res) {
    try {
        const { fullName, email, password } = req.body;
        
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isUserAlreadyExist = await userModel.findOne({ email });
        if (isUserAlreadyExist) {
            return res.status(400).json({ message: "User Already Exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({ fullName, email, password: hashedPassword });
        
        generateTokenAndSetCookie(res, user._id, "userToken");
        
        res.status(201).json({
            message: "User registered successfully",
            user: { _id: user._id, email: user.email, fullName: user.fullName }
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        
        generateTokenAndSetCookie(res, user._id, "userToken");
        
        res.status(200).json({
            message: "User logged in successfully",
            user: { _id: user._id, email: user.email, fullName: user.fullName }
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

async function logoutUser(req, res) {
    res.clearCookie("userToken");
    res.status(200).json({ message: "User logged out successfully" });
}
async function registerFoodPartner(req, res) {
  try {
    const { name, email, password, phone, address, contactName } = req.body;

    if (!name || !email || !password || !phone || !address || !contactName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });
    if (isAccountAlreadyExists) {
      return res.status(400).json({ message: "Food partner account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const foodPartner = await foodPartnerModel.create({
      name, email, password: hashedPassword, phone, address, contactName
    });

    generateTokenAndSetCookie(res, foodPartner._id, "foodPartnerToken");

    res.status(201).json({
      message: "Food partner registered successfully",
      foodPartner: { _id: foodPartner._id, email: foodPartner.email, name: foodPartner.name }
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

async function loginFoodPartner(req, res) {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const foodPartner = await foodPartnerModel.findOne({ email });
        if (!foodPartner || !(await bcrypt.compare(password, foodPartner.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        
        generateTokenAndSetCookie(res, foodPartner._id, "foodPartnerToken");
        
        res.status(200).json({
            message: "Food partner logged in successfully",
            foodPartner: { _id: foodPartner._id, email: foodPartner.email, name: foodPartner.name }
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

async function logoutFoodPartner(req, res) {
    res.clearCookie("foodPartnerToken");
    res.status(200).json({ message: "Food partner logged out successfully" });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
};
