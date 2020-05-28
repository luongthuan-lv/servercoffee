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
let DataUser = mongoose.model('user', userSchema, 'user');
let DataProduct = mongoose.model('product', productSchema, 'product');
let DataInvoice = mongoose.model('invoice', invoiceSchema, 'invoice');
let DataCustomer = mongoose.model('customer', customerSchema, 'customer');

app.use(body.json());
// sử dụng thư viện để post
app.use(body.urlencoded({extended: true}));

// chạy lên local host với port là 1212
app.listen(1212);
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
    let dataUser = await DataUser.find({});

    let dataProduct = await DataProduct.find({});

    let dataInvoice = await DataInvoice.find({});

    let dataCustomer = await DataCustomer.find({});
    try {
        res.send([dataProduct, dataCustomer, dataInvoice, dataUser]);
    } catch (e) {
        res.send('Có lỗi sảy ra khi lay du lieu ' + e.message)
    }
});

app.post('/login1', async (req, res) => {

    let condition = {
        username: req.body.username,
        password: req.body.password,
    };
    console.log(req.body.username, req.body.password);
    try {
        const user = await DataUser.findOne(condition);
        if (!user) {
            res.send('Invalid numberphone or password !')
        } else {
            res.send(user);

        }
    } catch (error) {
        res.status(400).send(error);

    }
});

app.post('/login', function (request, response) {
    let username = request.body.username;
    let password = request.body.password;
    DataUser.findOne({
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

app.post('/update-info', async (req, res) => {
    let idUser = req.body.id;
    let newUsername = req.body.username;
    let newPassword = req.body.password;
    let newFullname = req.body.fullname;
    let newBirthday = req.body.birthday;
    let newTelephoneNumber = req.body.telephoneNumber;
    let newRole = req.body.role;
    try {
        console.log(newUsername, newPassword,newFullname,newBirthday,newTelephoneNumber,newRole,idUser);
        const updateuser = await DataUser.findByIdAndUpdate(id=idUser, ({
            username: newUsername,
            password: newPassword,
            fullname: newFullname,
            birthday: newBirthday,
            telephoneNumber: newTelephoneNumber,
            role: newRole

        }));

        if (!updateuser) {
            res.json({
                message: 'Update thành thất bại!'
            })
        } else {
            res.json({
                message: 'Update thành thành công!'
            })
        }
    } catch (e) {
        res.status(400).json({
            message: 'Lỗi: ' + e
        })
    }
});