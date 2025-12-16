
const userModel = require('../models/user.model')
const foodPartnerModel = require('../models/foodpartner')
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken')
async function registerUser(req, res) {
    try {
        const { fullName, email, password } = req.body;
        
        // Validate input
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required (fullName, email, password)"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET not defined in environment variables");
            return res.status(500).json({
                message: "Server configuration error. Please contact administrator."
            });
        }

        // Check MongoDB connection
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
            console.error("MongoDB is not connected. Connection state:", mongoose.connection.readyState);
            return res.status(500).json({
                message: "Database connection error. Please try again later."
            });
        }

        const isUserAlreadyExist = await userModel.findOne({ email })
        if (isUserAlreadyExist) {
            return res.status(400).json({
                message: "User pehle se hai mere bhai"
            })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            fullName,
            email,
            password: hashedPassword
        })
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false, // false for localhost, true for production HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        })
    } catch (err) {
        console.error("REGISTER USER ERROR:", err);
        console.error("Error Stack:", err.stack);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
}
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET not defined in environment variables");
            return res.status(500).json({
                message: "Server configuration error. Please contact administrator."
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found with this email"
            })
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Password is incorrect"
            })
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false, // false for localhost, true for production HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        res.status(201).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        })
    } catch (err) {
        console.error("LOGIN USER ERROR:", err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}
async function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    })
}
async function registerFoodPartner(req, res) {
  try {
    console.log("REQ BODY:", req.body);

    const { name, email, password, phone, address, contactName } = req.body;

    // Validate input
    if (!name || !email || !password || !phone || !address || !contactName) {
      return res.status(400).json({ 
        message: "All fields are required (name, email, password, phone, address, contactName)" 
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not defined in environment variables");
      return res.status(500).json({
        message: "Server configuration error. Please contact administrator."
      });
    }

    // Check MongoDB connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB is not connected. Connection state:", mongoose.connection.readyState);
      return res.status(500).json({
        message: "Database connection error. Please try again later."
      });
    }

    const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });
    if (isAccountAlreadyExists) {
      return res.status(400).json({
        message: "Food partner account already exists with this email"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      contactName
    });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    const token = jwt.sign(
      { id: foodPartner._id },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // false for localhost, true for production HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: "Food partner registered successfully",
      foodPartner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name
      }
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
}

async function loginFoodPartner(req, res) {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET not defined in environment variables");
            return res.status(500).json({
                message: "Server configuration error. Please contact administrator."
            });
        }

        const foodPartner = await foodPartnerModel.findOne({ email });
        if (!foodPartner) {
            return res.status(400).json({
                message: "Food partner account not found with this email"
            })
        }
        
        const isPasswordMatch = await bcrypt.compare(password, foodPartner.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Password is incorrect"
            })
        }
        
        const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false, // false for localhost, true for production HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        res.status(201).json({
            message: "Food partner logged in successfully",
            foodPartner: {
                _id: foodPartner._id,
                email: foodPartner.email,
                name: foodPartner.name
            }
        })
    } catch (err) {
        console.error("LOGIN FOOD PARTNER ERROR:", err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}
async function logoutFoodPartner(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "Food partner logged out successfully"
    })
}
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}