const express = require('express');
const { transferBody } = require('../types');

const mongoose = require('mongoose');
const { Account, User } = require('../db');
const { authMiddleware } = require('../middleware');

const router = express.Router();


// Get account Balance Controller
router.get('/balance', authMiddleware, async (req, res) => {
    const userId = req.userId;

    const account = await Account.findOne({ userId: userId});
    if(!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }

    return res.status(200).json({
        balance: account.balance
    });
})

// Transfer Amount Controller
router.post('/transfer', authMiddleware, async (req, res) => {
    const { success } = transferBody.safeParse(req.body);
    if(!success) {
        return res.status(411).json({
            message: "Invalid Inputs"
        })
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const { toUsername, amount } = req.body;

    // Extract account details of sender
    const fromAccount = await Account.findOne({ userId: req.userId }).session(session);
    if(!fromAccount) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
            message: "Sender Account not found"
        })
    }
    // Check if sender has sufficient balance
    if(fromAccount.balance < amount) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
            message: "Insufficient balance"
        })
    }

    // Extract account details of receiver
    const toUser = await User.findOne({ username: toUsername }).session(session);
    if(!toUser) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
            message: "Receiver User not found"
        })
    }
    const toAccount = await Account.findOne({ userId: toUser._id }).session(session);
    if(!toAccount) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
            message: "Receiver Account not found"
        })
    }

    // Perform Transfer Transaction
   await Account.updateOne(
    { userId: req.userId },           // FILTER
    { $inc: { balance: -amount } }   // UPDATE
).session(session);                 // BIND TO TRANSACTION

    await Account.updateOne({ userId: toUser._id }, {
        $inc: { balance: amount }
    }).session(session);


    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
        message: "Transfer successful"
    });

   
})


module.exports = router;