let mongoose=require('mongoose');
const productSchema=new mongoose.Schema({
    productName:{
        type: String,
        required: true,
    },
    productPrice:{
        type: String,
        required: true,
    },
    productImage:{
        type: String,
        required: true,
    },
    productType:{
        type: String,
        required: true,
    },
    productExport:{
        type: String,
        required: true,
    }
});
module.exports=productSchema;