const foodModel = require('../models/fooditem.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { v4: uuid } = require("uuid")


async function createFood(req, res) {
    try {
        if (!req.foodPartner) {
            return res.status(403).json({ message: "Only food partners can upload food" });
        }

        if (!req.foodPartner._id) {
            return res.status(403).json({ message: "Partner authentication failed" });
        }

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Video file is required" });
        }

        // Validate required fields
        if (!req.body.name || !req.body.name.trim()) {
            return res.status(400).json({ message: "Food name is required" });
        }

        console.log("Uploading file to storage...");
        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());
        
        if (!fileUploadResult || !fileUploadResult.url) {
            return res.status(500).json({ message: "Failed to upload video file" });
        }

        console.log("Creating food item in database...");
        const foodItem = await foodModel.create({
            name: req.body.name.trim(),
            description: req.body.description || '',
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id
        });

        res.status(201).json({
            message: "Food created successfully",
            food: foodItem
        });
    } catch (err) {
        console.error("CREATE FOOD ERROR:", err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}


async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({})
    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems
    })
}


async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "Food unliked successfully",
            like: false
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "Food liked successfully",
        like: true,
        likeData: like
    })

}

async function saveFood(req, res) {

    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        })

        return res.status(200).json({
            message: "Food unsaved successfully",
            save: false
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    })

    res.status(201).json({
        message: "Food saved successfully",
        save: true,
        saveData: save
    })

}

async function getSaveFood(req, res) {

    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods
    });

}


module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood
}