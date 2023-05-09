const express = require('express')
const { songModel } = require('../models/song')

const songRouter = express.Router()

songRouter.post('/', async (req, res) => {
    try {
        const {name , author} = req.body
        const song = await songModel.create({name, author})
        res.send(song) 
    } catch(error) {
        console.log('Error', error)
        res.send( 'Sever error')
    }
})
module.exports = { songRouter }