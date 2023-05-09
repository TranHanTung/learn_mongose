const mongoose = require('mongoose')

mongoose.connect('mongodb://0.0.0.0:27017/mindx')
const songSchema = new mongoose.Schema({
    name:String,
    author:String
})

const songModel = mongoose.model('songs', songSchema)
module.exports = { songModel }