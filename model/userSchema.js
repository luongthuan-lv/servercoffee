let mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    fullName:{
        type: String,
        required: false,
    },
    password:{
        type: String,
        required: true,
    },
    birthday:{
        type: String,
        required: false,
    },
    telephoneNumber:{
        type: String,
        required: false,
    },
    role:{
        type: String,
        required: true,
    }
});
module.exports=userSchema;