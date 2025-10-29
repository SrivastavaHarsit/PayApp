const zod = require('zod');


const signUpBody = zod.object({
    username: zod.string().email().min(3).max(30),
    firstName: zod.string().max(50),
    lastName: zod.string().max(50),
    password: zod.string().min(6),
})

const signInBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
})

const updateBody = zod.object({
    firstName: zod.string().max(50).optional(),
    lastName: zod.string().max(50).optional(),
    password: zod.string().min(6).optional(),
})

const transferBody = zod.object({
    toUsername: zod.string().email(),
    amount: zod.number().min(1),
})

module.exports = {
    signUpBody,
    signInBody,
    updateBody,
    transferBody
}