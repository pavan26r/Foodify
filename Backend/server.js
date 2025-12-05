// start server.js
const app = require('./src/app');
const connectDB = require('./src/db/db');
require('dotenv').config();
connectDB();
// start maar do ab ise ->
// kisi bhi port pr chla do ise bhai ab ->
app.listen(3000, () => {
console.log("Pavan bhai ka server is running on port 3000");
});