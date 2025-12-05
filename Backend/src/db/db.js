const mongoose = require('mongoose');


function connectDB() {
    mongoose.connect(process.env.MONGODB_URI).then(()=>
    {
        console.log("Connected to MongoDB successfully")
    }
    ).catch((err) =>{
        console.log("Mongodb get connected",err);
    })

}
module.exports = connectDB;
