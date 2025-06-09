const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        trim: true,

    },
    code: {
        type: String,
        trim: true, 
    },
    specificProduct :{
        type: String, 
        trim: true
    },
    origin: {
        type: String,
        trim: true,

    },
    brand:{
        type: String,
        trim : true 
    },
    yrs_manu: {
        type: String,
        trim: true,
    },
    price:
    {
        type: Number , 
        trim :true
    },
    unit: {
        type: String,
        trim: true
    },
    priceDate: {
        type: String,
        trim: true
    },
    supplier: {
        type: String,
        default: true
    },
    note: {
        type: String, 
        trim : true
    },

}, { timestamps: true }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product