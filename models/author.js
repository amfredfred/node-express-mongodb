const mongoose = require('mongoose')

const authoScheme = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Author', authoScheme)