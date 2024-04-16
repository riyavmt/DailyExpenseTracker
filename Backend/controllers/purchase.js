const Order = require("../models/order") ;
const User = require("../models/user");
const Razorpay = require('razorpay');
const keyId = process.env.KEY_ID;
const keySecret = process.env.KEY_SECRET;

exports.getBuyPremium = async(req,res)=>{   //get req is recieved
    try{
        const rzp = new Razorpay({ //creating a razorpay instance using key id and key secret provided by razorpay
            key_id: keyId,
            key_secret: keySecret //gives access to my razorpay account
        });
        const amount = 2500;//fixed amt in paise 
        rzp.orders.create({amount,currency: "INR"}, async(err,order) =>{ // calls the create method on razorpay instance to create a new payment order
            if(err){
                console.log(err) //if error during the order creation, it is logged
            }
            console.log(order);
            const newOrder = new Order({userId: req.user._id, orderId : order.id , status :'PENDING', userId: req.user._id})
            await newOrder.save(); //else an order record is created 
            res.status(201).json({order,key_id : rzp.key_id}) //order:razorpay order details (to be used in frontend)
            
        })
    }
    catch(err){
        console.log(err);
    }

} 
exports.postupdateTransaction = async(req,res)=>{ //post req
    try{
        const {payment_id , order_id, success} = req.body; //body in the req function
        if(success){ //if success is true
            const order =await Order.findOne({orderId : order_id}); //
            // const updatePaymentId = await Order.findOne({orderId : order_id});
            await order.updateOne({paymentId: payment_id , status : "SUCCESSFUL"})
            const updatePremiumStatus = await User.findOne({_id : order.userId});
            await updatePremiumStatus.updateOne({premium_user: true});
            res.status(202).json({success:true , message: "Transaction successful"});
        }
        else{
            const updateStatus = await Order.findOne({orderId : order_id});
            await updateStatus.updateOne({paymentId: payment_id, status : "FAILED"}); 
            res.status(202).json({success:false , message: "Transaction unsuccessful"});
        }
    }
    catch(err){
        console.log(err)
    }
}
