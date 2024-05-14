const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ["user", "admin"]
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    }
})

schema.pre('find', function(){
    this.populate('cart')
})

schema.pre('findOne', function(){
    this.populate('cart')
})

module.exports = mongoose.model('User', schema, 'users')