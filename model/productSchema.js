let mongoose=require('mongoose');
const productSchema=new mongoose.Schema({
    productName:{
        type: String,
        required: true,
    },
    productPrice:{
        type: Number,
        required: true,
    },
    productImage:{
        type: String,
        required: false,
    },
    productType:{
        type: String,
        required: true,
    },
    // productExport:{
    //     type: Number,
    //     required: true,
    // }
});
module.exports=productSchema;