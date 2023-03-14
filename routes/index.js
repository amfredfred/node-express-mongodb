const express = require('express')
const router = express.Router()
const Book = require('../models/books')

router.get('', async (req, res) => {

    const [books] = await Promise.allSettled([
        Book.find().sort({ 'createdAt': 'desc' }).limit(10).exec()
    ])

    res.render('index', { books: books.value ?? [] })
})

module.exports = router