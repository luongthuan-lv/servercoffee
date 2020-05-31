let mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    fullName:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    birthday:{
        type: String,
        required: true,
    },
    telephoneNumber:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
    }
});
module.exports=userSchema;