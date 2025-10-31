const express = require('express');
const jwt = require('jsonwebtoken');

const { signUpBody, signInBody, updateBody } = require('../types');
const { User, Account } = require('../db');
const { JWT_SECRET  } = require('../config');
const { authMiddleware } = require('../middleware');
const router = express.Router();



// SignUp Controller
router.post('/signup', async (req, res) => {
    // Validation
    const { success } = signUpBody.safeParse(req.body);
    if(!success) {
        return res.status(411).json({
            message: "Invalid Inputs"
        })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
        username: req.body.username
    })
    if(existingUser) {
        return res.status(409).json({
            message: "User already exists"
        })
    }

    // Create new User
    const newUser = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })

    // Generate JWT Token
    const userId = newUser._id;
    const token = jwt.sign({ userId}, JWT_SECRET);

    // Create an associated Account with random balance between 1 and 10000
    const initialBalance = Math.floor(Math.random() * 10000) + 1;
    await Account.create({
        userId: userId,
        balance: initialBalance
    })

    return res.status(201).json({
        message: "User created successfully",
        token: token
    })
})


// SignIn Controller
router.post('/signin', async (req, res) => {
    const { success } = signInBody.safeParse(req.body);
    if(!success) {
        return res.status(411).json({
            message: "Invalid Inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })
    if(!user) {
        return res.status(401).json({
            message: "Invalid username or password"
        })
    }

    const token = jwt.sign({ userId: user._id}, JWT_SECRET);

    return res.status(200).json({
        message: "SignIn successful",
        token: token
    })
})

// Update User Controller
router.put('/', authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if(!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    const updated = await User.findByIdAndUpdate({
        _id: req.userId // "find the user with this ID"
    }, {
        ...req.body // "Take all the new info from the request body and update it"
    }, {
        new: true // "Please show me how they look AFTER the makeover"
    })

    return res.status(200).json({
        message: "User information updated successfully",
        user: updated
    })
})

// Get User Info from Query Params using firstname or lastname
router.get('/bulk', async (req, res) => {
    const filter = req.query.filter || '';

    const users = await User.find({
        $or: [ // find me users that match EITHER of these conditions"

            // Condition 1: First name matches the seacrh
            { 
                firstName: { 
                    $regex: filter, // "Look for this pattern in the name"
                    $options: 'i'  // "i" means (case-insensitive)
                } 
            },

            // Condition 2: Last name matches the search
            { 
                lastName: { 
                    $regex: filter, 
                    $options: 'i' 
                } 
            }
        ]
    });

    return res.status(200).json({
        users: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


// Get all users and balance (For testing/debugging purposes)
// router.get('/', async (req, res) => {
//     const users = await User.find({});

//     // Use Promise.all over users.map so we wait for all async lookups
//     // otherwise forEach with async callbacks will not be awaited and
//     // usersWithBalance will be empty when we send the response.
//     // const usersWithBalance = await Promise.all(users.map(async (user) => {
//     //     const account = await Account.findOne({ userId: user._id });
//     //     return {
//     //         username: user.username,
//     //         firstName: user.firstName,
//     //         lastName: user.lastName,
//     //         balance: account ? account.balance : 0,
//     //         _id: user._id
//     //     };
//     // }));


//     // JOIN query ran by mongodb query using $lookup
//      const usersWithBalance = await User.aggregate([
//     {
//       $lookup: {
//         from: "accounts",          // collection name in MongoDB
//         localField: "_id",         // field in User
//         foreignField: "userId",    // field in Account
//         as: "accountInfo"
//       }
//     },
//     {
//       $unwind: {
//         path: "$accountInfo",
//         preserveNullAndEmptyArrays: true
//       }
//     },
//     {
//       $project: {
//         username: 1,
//         firstName: 1,
//         lastName: 1,
//         balance: { $ifNull: ["$accountInfo.balance", 0] }
//       }
//     }
//   ]);

//     return res.status(200).json({
//         users: usersWithBalance
//     })
// });

module.exports = router;
