const mongoose = require('mongoose')

const coverImagePath = 'uploads/bookCovers'
const path = require('path')

const bookScheme = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    publishDate: { type: Date, required: true, },
    pageCount: { type: Number, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    coverImageName: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Author"
    }
})

bookScheme.virtual('coverImagePath').get(function () {
    if (this.coverImageName) {
        return path.join('/', coverImagePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Book', bookScheme)
module.exports.coverImageBasePath = coverImagePath