let mongoose=require('mongoose');
const invoiceSchema=new mongoose.Schema({
    customerName:{
        type: String,
        required: true,
    },
    productName:{
        type: String,
        required: true,
    },
    numberOfProduct:{
        type: Number,
        required: true,
    },
    createDate:{
        type: String,
        required: true,
    },
    createStaff:{
        type: String,
        required: true,
    },
    discountPercentage:{
        type: Number,
        required: true,
    },
    totalValue:{
        type: Number,
        required: true,
    },
    state:{
        type: String,
        required: true,
    },
    list:{
        type: Array,
        required: true,
    },



});
module.exports=invoiceSchema;