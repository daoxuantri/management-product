const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema({
    name: {
        type: String,
        trim: true,

    },
    code: {
        type: String,
        trim: true
    },
    time: {
        type: String,
        trim: true
    },
    supervisor: {
        type: String,
        trim: true
    },
    list_product: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number , default : 0},
            total_product: { type: Number , default : 0}
        }
    ],
    total: {
        type: Number,
        default: 0
    },
    progress: {
        type: String,
        trim: true
    },
    note: {
        type: String,
        trim: true
    }

}, { timestamps: true }
);
const Project = mongoose.model("Project", projectSchema);
module.exports = Project
