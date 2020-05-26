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
        type: String,
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
        type: String,
        required: true,
    },
    totalValue:{
        type: String,
        required: true,
    },
    state:{
        type: String,
        required: true,
    },

});
module.exports=invoiceSchema;