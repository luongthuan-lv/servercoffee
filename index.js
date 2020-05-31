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
        const updateUser = await Users.findOneAndUpdate(id = idUser, ({
            fullName: newfullName,
            birthday: newbirthday,
            telephoneNumber: newtelephoneNumber,

        }));

        if (!updateUser) {
            res.status(400).json({
                message: 'Update thất bại!'
            })
        } else {
            res.json({
                message: 'Update thành công!'
            })
        }
    } catch (e) {
        res.status(400).json({
            message: 'Lỗi: ' + e
        })
    }
});

// update password
app.post('/update-pass', async (req, res) => {
    let idUser = req.body.id;
    let newpassword = req.body.password;
    try {
        console.log( newpassword,idUser);
        const updateUser = await DataUser.findOneAndUpdate(id = idUser, ({
            password: newPassword,
        }));

        if (!updateUser) {
            res.status(400).json({
                message: 'Update password thất bại!'
            })
        } else {
            res.json({
                message: 'Update password thành công!'
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
        const removeDataUser=await Users.findOneAndDelete(id=idUser);
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

