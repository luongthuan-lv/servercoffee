let mongoose=require('mongoose');
const invoiceSchema=new mongoose.Schema({
    customerName:{
        type: String,
        required: false,
    },
    productName:{
        type: Array,
        required: false,
    },
    numberOfProduct:{
        type: Array,
        required: false,
    },
    createDate:{
        type: String,
        required: false,
    },
    createStaff:{
        type: String,
        required: false,
    },
    discountPercentage:{
        type: Number,
        required: false,
    },
    totalValue:{
        type: Number,
        required: false,
    },
    state:{
        type: String,
        required: false,
    },
    list:{
        type: Array,
        required: false,
    },



});
module.exports=invoiceSchema;