import express from "express";
import Inventory from "../models/Inventory.js";
import fetchUser from '../middleware/fetchUser.js';

const router = express.Router();

router.get("/",fetchUser, async (req, res) => {
    try {
        const inventory = await Inventory.find({companyName: req.user.companyName});
        res.status(200).json({products:inventory});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get("/search", fetchUser, async (req, res) => {
   const slug  = req.query.slug;

   try{
        const query = {
            slug: { $regex: slug, $options: "i" },
            companyName: req.user.companyName
        }

        const inventory = await Inventory.find(query);
        res.status(200).json({products:inventory});
   }
   catch(error){
       res.status(500).json({error: error.message})
   }

})

router.post("/addSlug",fetchUser,async (req, res) => {
    const { slug, quantity, price } = req.body;

    try {
        if (!slug || !quantity || !price) {
            return res.status(400).json({ msg: "Not all fields have been entered" })
        }

        const newInventory = await Inventory.create({
            slug,
            quantity,
            price,
            companyName: req.user.companyName
        })

        res.status(200).json({products:newInventory, message: "Slug added successfully"})
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.put("/updateSlug/:id",fetchUser, async (req, res) => {
    const { slug, quantity, price } = req.body;

    try {
        
        const dataExist = await Inventory.findById(req.params.id)

        if(!dataExist){
            return res.status(400).json( {msg:"data Does not exist"})
        }

        const updateData = {}

        if(slug && slug!="") {
            updateData.slug = slug
        }
        if(quantity && quantity!=""){
            updateData.quantity = quantity
        }
        if(price && price!=""){
            updateData.price = price
        }

        const updatedInventory = await Inventory.findByIdAndUpdate(req.params.id, {$set: updateData}, { new: true })

        res.status(200).json({updatedInventory, message: "Slug updated successfully"})
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.delete("/deleteSlug/:id",fetchUser, async (req, res) => {
    try {
        const slug = await Inventory.findById(req.params.id);

        if(!slug){
            return res.status(400).json({msg: "No slug found with this id"})
        }

        const deletedInventory = await Inventory.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedInventory)
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post("/action",fetchUser,async (req, res) => {
    const {action,slug,initialQuantiy}  = req.body;

    try{
        let newQuantity =  action == "plus" ? (parseInt(initialQuantiy)+1) : (parseInt(initialQuantiy)-1);
        const filter = { slug: slug };
        const update = { quantity: newQuantity };

        const upadetData =await  Inventory.findOneAndUpdate(filter, update);
        res.status(200).json({upadetData, message: "Slug updated successfully"})
        
    }
    catch(error){
        res.status(500).json({ error: error.message })
    }
})

export default router;