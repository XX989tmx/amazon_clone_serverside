const Order = require('../models/order')
const User = require('../models/user')
const Product = require('../models/product')

const createOrder = async (req, res, next) => {

    const userId = req.params.userId;
    const addressId = req.params.addressId;

    let user;
    try {
        user = await User.findById(userId);
    } catch (error) {
        console.log(error);
    };

    
    
    // new Order({
    //     items: user.cart.items,
    //     totalPrice: user.cart.totalPrice,
    //     dateOrdered: new Date().toString(),
    //     user: userId
    // })

};

exports.createOrder = createOrder;
