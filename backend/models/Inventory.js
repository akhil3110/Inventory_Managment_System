import mongoose from 'mongoose';


const InventorySchema = new mongoose.Schema({
    slug:{
        type: String,
        required: true,
    },
    quantity:{
        type: Number,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    companyName:{
        type: String,
        ref: 'User'
    }
},{timestamps: true})

const Inventory = mongoose.model('Inventory', InventorySchema);

export default Inventory;