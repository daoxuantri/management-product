const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema ({
    username:{
        type: String,
        trim : true ,
        
    },
    email:{
        type: String,
        required: true,
        trim: true ,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        trim: true ,

    },
    contact:{
        type: String,
        required: true,
        trim: true ,
    },
    status: {
        type : Boolean, 
        default : true
    }
},{ timestamps: true }
);
const User = mongoose.model("User",userSchema);
module.exports= User    