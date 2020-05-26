let mongoose=require('mongoose');
const customerSchema=new mongoose.Schema({
    customerName:{
        type: String,
        required: true,
    },
    customerPhone:{
        type: String,
        required: true,
    },
    customerInvoiceSum:{
        type: String,
        required: true,
    }
});
module.exports=customerSchema;