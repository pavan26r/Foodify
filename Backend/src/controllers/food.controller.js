const foodModel = require('../models/fooditem.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
    try {
        if (!req.foodPartner || !req.foodPartner._id) {
            return res.status(403).json({ message: "Only authenticated food partners can upload food" });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Video file is required" });
        }
        if (!req.body.name || !req.body.name.trim()) {
            return res.status(400).json({ message: "Food name is required" });
        }
        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());
        if (!fileUploadResult || !fileUploadResult.url) {
            return res.status(500).json({ message: "Failed to upload video file" });
        }
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
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

async function getFoodItems(req, res) {
    try {
        const foodItems = await foodModel.find({});
        res.status(200).json({
            message: "Food items fetched successfully",
            foodItems
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

async function likeFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        const isAlreadyLiked = await likeModel.findOne({ user: user._id, food: foodId });

        if (isAlreadyLiked) {
            await likeModel.deleteOne({ user: user._id, food: foodId });
            await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });

            return res.status(200).json({
                message: "Food unliked successfully",
                like: false
            });
        }

        const like = await likeModel.create({ user: user._id, food: foodId });
        await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });

        res.status(201).json({
            message: "Food liked successfully",
            like: true,
            likeData: like
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

async function saveFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        const isAlreadySaved = await saveModel.findOne({ user: user._id, food: foodId });

        if (isAlreadySaved) {
            await saveModel.deleteOne({ user: user._id, food: foodId });
            await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: -1 } });

            return res.status(200).json({
                message: "Food unsaved successfully",
                save: false
            });
        }

        const save = await saveModel.create({ user: user._id, food: foodId });
        await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: 1 } });

        res.status(201).json({
            message: "Food saved successfully",
            save: true,
            saveData: save
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

async function getSaveFood(req, res) {
    try {
        const user = req.user;
        const savedFoods = await saveModel.find({ user: user._id }).populate('food');

        if (!savedFoods || savedFoods.length === 0) {
            return res.status(404).json({ message: "No saved foods found" });
        }

        res.status(200).json({
            message: "Saved foods retrieved successfully",
            savedFoods
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood
};
