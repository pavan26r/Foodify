const express = require('express');
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middlewares/auth.middlewares");
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authMiddleware.authFoodPartnerMiddleware, upload.single("mama"), foodController.createFood);
router.get("/", authMiddleware.authUserMiddleware, foodController.getFoodItems);
router.post('/like', authMiddleware.authUserMiddleware, foodController.likeFood);
router.post('/save', authMiddleware.authUserMiddleware, foodController.saveFood);
router.get('/save', authMiddleware.authUserMiddleware, foodController.getSaveFood);

module.exports = router;
