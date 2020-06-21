let express = require('express');

// dùng để trảo đổi dữ liệu
let body = require('body-parser');

// dùng để upload file
let multer = require('multer');

// tạo app để cấu hình router
let app = express();
app.use(body.json());
let mongoose = require('mongoose');

// kết nối với data mongoose
mongoose.connect('mongodb+srv://luongthuan:lt05122000@cluster0-3bzbr.mongodb.net/CoffeeManagement', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(function () {
    console.log('Mongoose is connected');
});

// import các scheme ở mục model
let customerSchema = require('./model/customerSchema');
let invoiceSchema = require('./model/invoiceSchema');
let productSchema = require('./model/productSchema');
let userSchema = require('./model/userSchema');

// Tạo collision trong code
let Users = mongoose.model('user', userSchema, 'user');
let Products = mongoose.model('product', productSchema, 'product');
let Invoices = mongoose.model('invoice', invoiceSchema, 'invoice');
let Customers = mongoose.model('customer', customerSchema, 'customer');

app.use(body.json());
// sử dụng thư viện để post
app.use(body.urlencoded({extended: true}));

// chạy lên local host với port là 1212
app.listen(process.env.PORT || 1212);
console.log('Localhost: 1212');

// lấy ảnh từ bộ nhớ
let storage = multer.diskStorage({
    destination: function (required, response, cb) {
        cb(null, './uploads');
    },
    filename(req, file, callback) {
        let filename = `${Date.now()}-Coffee-${file.originalname}`;
        var pathss = '../uploads/' + filename;
        console.log(pathss);
        cb(null, filename)
    },

});
// giới hạn kích thước file không quá 2mb
let upload = multer({
    storage: storage, limits: {
        fileSize: 2 * 1024 * 1024
    }
});

app.get('/', async (req, res) => {
    let dataUser = await Users.find({});

    let dataProduct = await Products.find({});

    let dataInvoice = await Invoices.find({});

    let dataCustomer = await Customers.find({});
    try {
        res.send([dataProduct, dataCustomer, dataInvoice, dataUser]);
    } catch (e) {
        res.send('Có lỗi sảy ra khi lay du lieu ' + e.message)
    }
});


app.post('/login', function (request, response) {
    let username = request.body.username;
    let password = request.body.password;
    Users.findOne({
        username: username,
        password: password
    }, function (error, user) {
        if (error) {
            response.status(400).json({
                message: 'Lỗi: ' + error
            })
        }
        if (!user) {
            response.status(400).json({
                message: 'Sai tên đăng nhập hoặc mật khẩu!'
            });
        } else {
            response.json(user)
        }
    })
});


// update thông tin user
app.post('/update-info', async (req, res) => {
    let idUser = req.body.id;
    let newfullName = req.body.fullName;
    let newbirthday = req.body.birthday;
    let newtelephoneNumber = req.body.telephoneNumber;
    try {
        console.log(newfullName, newbirthday, newtelephoneNumber, idUser);
        const updateUser = await Users.findByIdAndUpdate(id = idUser, ({
            fullName: newfullName,
            birthday: newbirthday,
            telephoneNumber: newtelephoneNumber,

        }));

        if (!updateUser) {
            res.status(400).json({
                message: 'Cập nhật thất bại!'
            })
        } else {
            res.json({
                message: 'Cập nhật thành công!'
            })
        }
    } catch (e) {
        res.status(400).json({
            message: 'Lỗi: ' + e
        })
    }
});

// update password

// thay đổi findOneAndUpdate nếu không chỉ đổi đc giá trị đầu tiên ở trong bảng dữ liệu
app.post('/update-pass', async (req, res) => {
    let idUser = req.body.id;
    let newpassword = req.body.password;
    try {
        console.log( newpassword,idUser);
        const updateUser = await Users.findByIdAndUpdate(id = idUser, ({
            password: newpassword,
        }));

        if (!updateUser) {
            res.status(400).json({
                message: 'Cập nhật mật khẩu thất bại!'
            })
        } else {
            res.json({
                message: 'Cập nhật mật khẩu thành công!'
            })
        }
    } catch (e) {
        res.status(400).json({
            message: 'Lỗi: ' + e
        })
    }
});


// thêm thông tin user
app.post('/add-user', async (req, res) => {
    let addusername = req.body.username;
    let addpassword = req.body.password;
    let addfullName = req.body.fullName;
    let addbirthday = req.body.birthday;
    let addtelephoneNumber = req.body.telephoneNumber;
    let addrole = req.body.role;
    console.log(addusername, addpassword, addfullName, addbirthday, addtelephoneNumber, addrole);
    try {
        const addDataUser = new Users({
            username: addusername,
            password: addpassword,
            fullName: addfullName,
            birthday: addbirthday,
            telephoneNumber: addtelephoneNumber,
            role: addrole
        });
        if (!addDataUser) {
            res.status(400).json({
                message: 'Thêm thất bại!'
            })
        } else {
            await addDataUser.save();
            res.json({
                message: 'Thêm thành công!'
            })
        }
    }catch (e) {
        res.status(400).json({
            message: 'Lỗi: ' + e
        })
    }
});

// xóa thông tin user
app.post('/remove-user', async (req, res) => {
    let idUser = req.body.id;
    try{
        const removeDataUser=await Users.findByIdAndDelete(id=idUser);
        if (!removeDataUser){
            res.status(400).json({
                message: 'Xóa thất bại!'
            })
        }else{
            res.json({
                message: 'Xóa thành công!'
            })
        }
    }catch (e) {
        res.status(400).json({
            message: 'Lỗi: ' + e
        })
    }
});


// lấy danh sách user
app.get('/get-user-list', async (req, res) => {
    let role = req.query.role;
    let staffList=await Users.find({role:role});
    res.send(staffList);
});


// thêm thông tin customer
app.post('/add-customer', async (req, res) => {
    let addcustomerName = req.body.customerName;
    let addcustomerPhone = req.body.customerPhone;
    let addcustomerInvoiceSum = req.body.customerInvoiceSum;

    console.log(addcustomerName, addcustomerPhone, addcustomerInvoiceSum);
    try {
        const addDataCustomer = new Customers({
            customerName: addcustomerName,
            customerPhone: addcustomerPhone,
            customerInvoiceSum: addcustomerInvoiceSum,
        });
        if (!addDataCustomer) {
            res.status(400).json({
                message: 'Thêm thất bại!'
            })
        } else {
            await addDataCustomer.save();
            res.json({
                message: 'Thêm thành công!'
            })
        }
    }catch (e) {
        res.status(400).json({
            message: 'Lỗi: ' + e
        })
    }
});


// sửa thông tin customer
app.post('/update-customer', async (req, res) => {
    let id = req.body.id;
    let newcustomerName = req.body.customerName;
    let newcustomerPhone = req.body.customerPhone;
    let newcustomerInvoiceSum = req.body.customerInvoiceSum;
    try {
        console.log(newcustomerName, newcustomerPhone, newcustomerInvoiceSum, id);
        const updateCustomer = await Customers.findByIdAndUpdate(id = id, ({
            customerName: newcustomerName,
            customerPhone: newcustomerPhone,
            customerInvoiceSum: newcustomerInvoiceSum,

        }));

        if (!updateCustomer) {
            res.status(400).json({
                message: 'Cập nhật thất bại!'
            })
        } else {
            res.json({
                message: 'Cập nhật thành công!'
            })
        }
    } catch (e) {
        res.status(400).json({
            message: 'Lỗi: ' + e
        })
    }
});


// xóa thông tin customer
app.post('/remove-customer', async (req, res) => {
    let id = req.body.id;
    try{
        const removeDataCustomer=await Customers.findByIdAndDelete(id=id);
        if (!removeDataCustomer){
            res.status(400).json({
                message: 'Xóa thất bại!'
            })
        }else{
            res.json({
                message: 'Xóa thành công!'
            })
        }
    }catch (e) {
        res.status(400).json({
            message: 'Lỗi: ' + e
        })
    }
});


// lấy danh sách custommer
app.get('/get-customer-list', async (req, res) => {
    let customerList=await Customers.find({});
    res.send(customerList);
});


// thêm thông tin product
app.post('/add-product', async (req, res) => {
    let addproductName = req.body.productName;
    let addproductPrice = req.body.productPrice;
    let addproductImage = req.body.productImage;
    let addproductType = req.body.productType;
  //  let addproductExport = req.body.productExport;

    console.log(addproductName, addproductPrice, addproductImage,addproductType);
    try {
        const addDataProduct = new Products({
            productName: addproductName,
            productPrice: addproductPrice,
            productImage: addproductImage,
            productType:addproductType,
            //productExport:addproductExport
        });
        if (!addDataProduct) {
            res.status(400).json({
                message: 'Thêm thất bại!'
            })
        } else {
            await addDataProduct.save();
            res.json({
                message: 'Thêm thành công!'
            })
        }
    }catch (e) {
        res.status(400).json({
            message: 'Lỗi: ' + e
        })
    }
});


// sửa thông tin product
app.post('/update-product', async (req, res) => {
    let id = req.body.id;
    let newproductName = req.body.productName;
    let newproductPrice = req.body.productPrice;
    let newproductImage = req.body.productImage;
    let newproductType = req.body.productType;

    try {
        console.log(newproductName, newproductPrice, newproductImage, id,newproductType);
        const updateProduct = await Products.findByIdAndUpdate(id = id, ({
            productName: newproductName,
            productPrice: newproductPrice,
            productImage: newproductImage,
            productType:newproductType,
        }));

        if (!updateProduct) {
            res.status(400).json({
                message: 'Sửa sản phẩm thất bại!'
            })
        } else {
            res.json({
                message: 'Sửa sản phẩm thành công!'
            })
        }
    } catch (e) {
        res.status(400).json({
            message: 'Lỗi: ' + e
        })
    }
});


// xóa thông tin product
app.post('/remove-product', async (req, res) => {
    let id = req.body.id;
    try{
        const removeDataProduct=await Products.findByIdAndDelete(id=id);
        if (!removeDataProduct){
            res.status(400).json({
                message: 'Xóa thất bại!'
            })
        }else{
            res.json({
                message: 'Xóa thành công!'
            })
        }
    }catch (e) {
        res.status(400).json({
            message: 'Lỗi: ' + e
        })
    }
});


// lấy danh sách product
// app.get('/get-product-list', async (req, res) => {
//     let productList=await Products.find({});
//     res.send(productList);
// });

// lấy danh sách product theo tên
app.get('/get-product-list', async (req, res) => {
    let productName=req.query.productName;
    if (productName==""){
        let productList=await Products.find({});
        res.send(productList);
    }else{
        let productList=await Products.find({productName:productName});
        res.send(productList);
    }
});




// thêm thông tin invoice
app.post('/add-invoice', async (req, res) => {
    let addcustomerName = req.body.customerName;
    // let addproductName = req.body.productName;
    // let addnumberOfProduct = req.body.numberOfProduct;
    let addcreateDate = req.body.createDate;
    let addcreateStaff = req.body.createStaff;
    let adddiscountPercentage = req.body.discountPercentage;
    let addtotalValue = req.body.totalValue;
    let addstate = req.body.state;
    let addlist=req.body.list;


    console.log(addcustomerName, addcreateDate,addcreateStaff,adddiscountPercentage,addtotalValue,addstate,addlist);
    try {
        const addDataInvoice = new Invoices({
            customerName:addcustomerName,
            // productName: addproductName,
            // numberOfProduct: addnumberOfProduct,
            createDate: addcreateDate,
            createStaff:addcreateStaff,
            discountPercentage:adddiscountPercentage,
            totalValue:addtotalValue,
            state:addstate,
            list:addlist,
        });
        if (!addDataInvoice) {
            res.status(400).json({
                message: 'Thêm thất bại!'
            })
        } else {
            await addDataInvoice.save();
            res.json({
                message: 'Thêm thành công!'
            })
        }
    }catch (e) {
        res.status(400).json({
            message: 'Lỗi: ' + e
        })
    }
});


app.post('/state-invoice', async (req, res) => {
    let id = req.body.id;
    let newstate = req.body.state;
    try {
        console.log( newstate,id);
        const updateInvoice = await Invoices.findByIdAndUpdate(id = id, ({
            state: newstate,
        }));

        if (!updateInvoice) {
            res.status(400).json({
                message: 'Thay đổi trạng thái hóa đơn thất bại!'
            })
        } else {
            res.json({
                message: 'Thay đổi trạng thái hóa đơn thành công!'
            })
        }
    } catch (e) {
        res.status(400).json({
            message: 'Lỗi: ' + e
        })
    }
});


// lấy danh sách invoice
app.get('/get-invoice-list', async (req, res) => {
    let state = req.query.state;
    let invoiceList=await Invoices.find({state:state});
    res.send(invoiceList);
});

app.get('/sum-invoice', async (req, res) => {
    // const array1 = [1, 2, 3, 4];
    // const reducer = (accumulator, currentValue) => accumulator + currentValue;
    //
    //
    // console.log(array1.reduce(reducer));
    // res.send(array1.reduce(reducer));

   // let araysum=await Invoices.distinct("totalValue");

    // tổng tiền hóa đơn theo ngày
    let araysum=await Invoices.aggregate([
        { $match: { state: "active" } },
        { $group: { _id: "$createDate", total: { $sum: "$totalValue" } } },
        {
            $project: {
                // dataList: {
                //     $filter: {
                        // input: "$dataList",
                        // as: "item",
                        // cond: {
                            $and: [
                                {
                                    $gte: [ "$$createDate", new Date(`2020-04-05T17:00:00.000+00:00`) ]
                                },
                                {
                                    $lte: [ "$$createDate", new Date(`2020-05-05T17:00:00.000+00:00`) ]
                                },
                            ]
                       // }
                //     }
                // }
            }
        }


    ]);

    let araysum1=await Products.dataSize(araysum)([
        { $count: "productExport" }


    ]);

    res.send(araysum);
});