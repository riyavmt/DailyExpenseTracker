const Order = require("../models/order") ;
const User = require("../models/user");
const Razorpay = require('razorpay');
const keyId = process.env.KEY_ID;
const keySecret = process.env.KEY_SECRET;

exports.getBuyPremium = async(req,res)=>{
    try{
        const rzp = new Razorpay({
            key_id: keyId,
            key_secret: keySecret
        });
        const amount = 2500;
        rzp.orders.create({amount,currency: "INR"}, async(err,order) =>{
            if(err){
                console.log(err)
            }
            const newOrder = await Order.create({userId: req.user.userId, orderId : order.id , status :'PENDING'})
            res.status(201).json({order,key_id : rzp.key_id})
            
        })
    }
    catch(err){
        console.log(err);
    }

} 
exports.postupdateTransaction = async(req,res)=>{
    try{
        const {payment_id , order_id, success} = req.body;
        if(success){
            const order =await Order.findOne({where: {orderid : order_id}});
            const updatePaymentId = await Order.update({paymentId: payment_id , status : "SUCCESSFUL"},{where: {orderId : order_id}});
            const updatePremiumStatus = await User.update({premium_user: true},{where: {id : order.userId}}) 
            res.status(202).json({success:true , message: "Transaction successful"});
        }
        else{
            const updateStatus = await Order.update({paymentId: payment_id, status : "FAILED"},{where:{orderId : order_id}});
            res.status(202).json({success:false , message: "Transaction unsuccessful"});
        }
    }
    catch(err){
        console.log(err)
    }
}
