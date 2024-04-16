const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Message', schema, 'messages')