const express = require('express')
const Author = require('../models/author')
const router = express.Router()

//GET ALL AUTHORS
router.get('/', async (req, res) => {
    const query_options = {}
    if (Boolean(req.query.name)) {
        query_options.name = new RegExp(req.query.name, 'i')
    }
    const [authors] = await Promise.allSettled([
        Author.find(query_options)
    ])
    if (authors.status === 'rejected')
        res.redirect('')
    res.render('authors/index', { authors: authors.value, query_param: req.query})
})

//GET CREATE AUTHOR FORM 
router.get('/new', async (req, res) => {
    res.render('authors/new', { author: new Author() })
})

//CREATE ALL authors
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    const [save] = await Promise.allSettled([
        author.save()
    ])
    if (save.status === 'rejected')
        return res.render('authors/new', {
            name: req.body.name,
            errMessage: 'Something went wrong!!'
        })
    res.redirect(`authors`)
})








module.exports = router