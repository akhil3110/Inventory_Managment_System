import express from 'express'
import bodyParser from  'body-parser'
import mongoose from  'mongoose'
import cors  from  'cors'
import userRoute from './routes/userRoute.js'
import inventoryRoute from './routes/inventoryRoute.js'

var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

// parse application/json
app.use(bodyParser.json())

mongoose.connect(
    "mongodb+srv://inventory-management:inventory-management@cluster0.5ysxzj2.mongodb.net/",
   { useNewUrlParser: true, useUnifiedTopology: true }
 );
 const db = mongoose.connection;
 db.on("error", (err) => {
   console.log(err);
 });
 
 db.once("open", () => {
   console.log("Database Connected");
 });

 app.use('/api/user',userRoute)
 app.use('/api/inventory',inventoryRoute)

 app.listen(5000, ()=>{
      console.log("Server is running on port 5000")
 })
