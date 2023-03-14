const express = require('express')
const multer = require('multer')
const fs = require('fs')
const Author = require('../models/author')
const Book = require('../models/book')
const router = express.Router()
const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath)

const imageMineTypes = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg']

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMineTypes.includes(file.mimetype))
    }
})

//GET ALL AUTHORS / OR FILTER
router.get('/', async (req, res) => {
    let query_options = Book.find({})
    if (Boolean(req.query.title))
        query_options = query_options.regex('title', new RegExp(req.query.title, 'i'))
    if (Boolean(req.query.published_after))
        query_options = query_options.gte('publishDate', req.query.published_after)
    if (Boolean(req.query.published_before))
        query_options = query_options.lte('publishDate', req.query.published_before)
    const books = await query_options.exec()
    res.render('books/', { books, query_params: req.query })
})


//GET CREATE AUTHOR FORM 
router.get('/new', async (req, res) => {
    renderNewBookPage(res, new Book())
})

//CREATE ALL authors
router.post('/', upload.single('cover'), async (req, res) => {
    let fileName = Boolean(req.file) ? (req.file.filename + '.' + req.file.originalname.split('.')[1]) : null

    const newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
        coverImageName: fileName
    })

    const [book] = await Promise.allSettled([
        newBook.save(newBook)
    ])

    if (book.status === 'rejected') {
        Boolean(newBook.coverImageName) && removeBookCoverImageName(newBook.coverImageName)
        renderNewBookPage(res, newBook, true)
    }

    res.redirect('books')
})


function removeBookCoverImageName(FN) {
    fs.unlink(path.join(uploadPath, FN), (err) => console.error('ERROR: ', err))
}

async function renderNewBookPage(res, book, hasError = false) {
    const [authors] = await Promise.allSettled([
        Author.find({})
    ])
    const params = { authors: authors.value, book }
    if (hasError) params.errMessage = 'Error occured While Creating Book~'
    if (authors.status === 'rejected')
        res.redirect('books')
    res.render('books/new', { ...params })
}


module.exports = router