const mongoose = require('mongoose');
const config = require('./config');

const mongoUrl = config.MONGO_URL;

mongoose.connect(mongoUrl)
    .then(() => {
        console.log('Connected to Mongodb');
        console.log('Effective Mongo URL:', mongoUrl);
        console.log('Effective DB name:', mongoose.connection.name);
    })
    .catch(e => console.error('Error connecting to Mongodb', e));


// Create a Schema for Users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
})


// Create a Schema for Accounts
const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    }
});


const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = {
    User,
    Account
}