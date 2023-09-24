const {Cart} = require('../models/cart');
const express = require('express');
const { CartItem } = require('../models/cart-item');
const { Product } = require('../models/product');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const cartList = await Cart.find().populate('user', 'name').sort({'dateOrdered': -1});

    if(!cartList) {
        res.status(500).json({success: false})
    } 
    res.send(cartList);
});
router.get(`/:userId`, async (req, res) =>{
    try{
        const userId = req.params.userId;
        const cart = await Cart.findOne({user: userId})
        .populate('user', 'name')
        .populate({ 
            path: 'cartItems', populate: {
                path : 'product', populate: 'category'
            } 
            })
        res.status(200).send(cart);
    }
    catch(err){
        res.status(500).json({message: "some Unknown error", error: err});
    }
});

router.post('/', async (req,res)=>{
    const userId = req.body.user;
    const cart = await Cart.findOne({user: userId});
    const cartItemsIds = Promise.all(req.body.cartItems.map(async (cartItem) =>{
        let newCartItem = new CartItem({
            quantity: cartItem.quantity,
            product: cartItem.product
        });

        newCartItem = await newCartItem.save();

        return newCartItem._id;
    }));
    const cartItemsIdsResolved =  await cartItemsIds; //This is a promise; So, converting it to value;
    const totalPrices = await Promise.all(cartItemsIdsResolved.map(async (cartItemId)=>{
        const orderItem = await CartItem.findById(cartItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    })); //List of prices of the added items;
    if(cart){ //Add them in existing user Cart;
        //TODO: What if some items are already present in the cart? Then just increase their quantity!;
        const cartItemsAlreadyPresent = cart.cartItems.filter((productId)=>
            cartItemsIdsResolved.includes(productId._id.toString())
        );
        console.log(cartItemsAlreadyPresent)
        cart.cartItems.push(...cartItemsIdsResolved)
        const totalPrice = cart.totalPrice + totalPrices.reduce((a,b)=>a+b,0);
        cart.totalPrice = totalPrice;
        await cart.save();
        res.status(200).send(cart);
    }
    else{ //Create new Cart;
        const totalPrice = totalPrices.reduce((a,b) => a +b , 0);
        let cart = new Cart({
            cartItems: cartItemsIdsResolved,
            totalPrice: totalPrice,
            user: req.body.user,
        })
        cart = await cart.save();
    
        if(!cart)
        return res.status(400).send('the cart cannot be created!')
        res.send(cart);
    }
});

// router.post('/', async (req,res)=>{
//     const cartItemsIds = Promise.all(req.body.cartItems.map(async (cartItem) =>{
//         let newCartItem = new CartItem({
//             quantity: cartItem.quantity,
//             product: cartItem.product
//         });

//         newCartItem = await newCartItem.save();

//         return newCartItem._id;
//     }));
//     const cartItemsIdsResolved =  await cartItemsIds;

//     const totalPrices = await Promise.all(cartItemsIdsResolved.map(async (cartItemId)=>{
//         const orderItem = await CartItem.findById(cartItemId).populate('product', 'price');
//         const totalPrice = orderItem.product.price * orderItem.quantity;
//         return totalPrice
//     }))

//     const totalPrice = totalPrices.reduce((a,b) => a +b , 0);

//     let cart = new Cart({
//         cartItems: cartItemsIdsResolved,
//         totalPrice: totalPrice,
//         user: req.body.user,
//     })
//     cart = await cart.save();

//     if(!cart)
//     return res.status(400).send('the cart cannot be created!')

//     res.send(cart);
// });

// router.post('/increase/:userId/:productId', async(req, res)=>{ //ERROR HERE! TO be Updated!
//     try{
//         const userId = req.params.userId;
//         const productId = req.params.productId;
//         const cart = await Cart.findOne({user: userId});
//         if(!cart){
//             res.status(404).json({message: 'User has no Cart!'});
//         }
        
//         const existingCartItem = await cart.cartItems.find(async item => await item.product && item.product.toString() ===  productId);
//         if(!existingCartItem){
//             res.status(404).json({message: 'Cart does not contain this item'});
//         }
//         eci = await CartItem.findById(existingCartItem.toString());
//         eci.quantity += 1;
//         const product = await Product.findById(productId);
//         cart.totalPrice += product.price;
//         const updatedCart = await cart.save();
//         const updatedCartItems = await eci.save();
//         res.status(200).send(updatedCart);
//     }
//     catch(err){
//         res.status(500).send({message: 'Unexpected error while increasing quantity!', error: err});
//     }
// });
router.post('/increase/:userId/:productId', async(req, res)=>{ //ERROR HERE! TO be Updated!
    try{
        const userId = req.params.userId;
        const productId = req.params.productId;
        const cart = await Cart.findOne({user: userId}).populate({path: 'cartItems', populate: 'product'});
        const cartItem = cart.cartItems.find(item=> item.product._id.toString() === productId);
        console.log("CartItem: "+cartItem);
        if(!cartItem){
            res.status(404).json({message: "Cart does not contain product with this productId"});
        }
        cartItem.quantity += 1;
        const cartItemUpdated = await cartItem.save();
        cart.totalPrice += cartItem.product.price;
        await cart.save();
        // res.status(200).send(cart);
        res.status(200).send(cartItemUpdated);
    }
    catch(err){
        res.status(500).send({message: 'Unexpected error while increasing quantity!', error: err});
    }
});
router.post('/decrease/:userId/:productId', async(req, res)=>{ //ERROR HERE! TO be Updated!
    try{
        const userId = req.params.userId;
        const productId = req.params.productId;
        const cart = await Cart.findOne({user: userId}).populate({path: 'cartItems', populate: 'product'});
        const cartItem = cart.cartItems.find(item=> item.product._id.toString() === productId);
        console.log("CartItem: "+cartItem);
        if(!cartItem){
            res.status(404).json({message: "Cart does not contain product with this productId"});
        }
        if(cartItem.quantity > 1){
            cartItem.quantity -= 1;
            cart.totalPrice -= cartItem.product.price;
        }
        const cartItemUpdated = await cartItem.save();
        await cart.save();
        // res.status(200).send(cart);
        res.status(200).send(cartItemUpdated);
    }
    catch(err){
        res.status(500).send({message: 'Unexpected error while increasing quantity!', error: err});
    }
});
// router.post('/decrease/:userId/:productId', async(req, res)=>{
//     try{
//         const userId = req.params.userId;
//         const productId = req.params.productId;
//         const cart = await Cart.findOne({user: userId});
//         if(!cart){
//             res.status(404).json({message: 'User has no Cart!'});
//         }
        
//         const existingCartItem = await cart.cartItems.find(async item => await item.product && item.product.toString() ===  productId);
//         if(!existingCartItem){
//             res.status(404).json({message: 'Cart does not contain this item'});
//         }
//         eci = await CartItem.findById(existingCartItem.toString());
//         if(eci.quantity === 1){
//             res.status(404).json({message: 'Single item cannot be decreased'});
//         }
//         else{
//             eci.quantity -= 1;
//             const product = await Product.findById(productId);
//             cart.totalPrice -= product.price;
//             const updatedCart = await cart.save();
//             const updatedCartItems = await eci.save();
//             res.status(200).send(updatedCart);
//         }
//     }
//     catch(err){
//         res.status(500).send({message: 'Unexpected error while increasing quantity!', error: err});
//     }
// });

router.delete('/:userId/:productId', async(req, res)=>{
    try{
        const userId = req.params.userId;
        const productId = req.params.productId;
        // console.log("UserID: "+userId)
        // console.log("ProductId: "+productId)
        const userCart = await Cart.findOne({user: userId}).populate({path: 'cartItems', populate: 'product'});
        userCart.cartItems  = userCart.cartItems.filter((item)=>{
            if(item.product._id.toString() !== productId){
                return true;
            }
            else{
                userCart.totalPrice -= item.quantity * item.product.price;
            }
        });
        await userCart.save();
        await CartItem.deleteOne({product: productId});

        res.status(200).send(userCart)
    }
    catch(err){
        console.error(err);
    }
});

module.exports =router;