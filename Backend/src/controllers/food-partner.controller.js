const foodPartnerModel = require('../models/foodpartner');
const foodModel = require('../models/fooditem.model')

async function getFoodPartnerById(req,res){
    const foodPartnerId = req.params.id;
    // url se id fetch karne k liye hai ->
    const foodPartner = await foodPartnerModel.findById(foodPartnerId)
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId })
    if(!foodPartner){
        return res.status(404).json({
            message: "Food Partner not found"
        })
    }
    res.status(200).json({
        message: "Food Partner fetched successfully",
        foodPartner:{
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner
        }
    })
}
module.exports = {
    getFoodPartnerById
}