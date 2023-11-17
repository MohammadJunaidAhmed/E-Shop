const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./src/helpers/jwt');
const errorHandler = require('./src/helpers/error-handler');
const bodyParser = require('body-parser');


app.use(cors());
app.options('*', cors())

//middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//Routes
const categoriesRoutes = require('./src/routes/categories');
const productsRoutes = require('./src/routes/products');
const usersRoutes = require('./src/routes/users');
const ordersRoutes = require('./src/routes/orders');
const cartRoutes = require('./src/routes/cart');

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/carts`, cartRoutes);

// app.post('/',(req, res)=>{
//     const test = req.body;
//     console.log(test);
//     res.send(test).status(200);
// });

//Database
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-database'
})
.then(()=>{
    console.log('Database Connection is ready...')
    //Server
    app.listen(3000, ()=>{
    
        console.log('server is running http://localhost:3000');
    })
})
.catch((err)=> {
    console.log(err);
})

