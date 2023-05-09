const express = require('express')
const jwt = require('jsonwebtoken')
const { users, getAllUsers, userModel } = require('../models/user')

const userRouter = express.Router()

const authorizationCheck = (req, res, next) => {
    const userRoles = req.user.role
    // Check xem user nay co quyen lay toan bo user khong (Authorization) == check role
    if (userRoles.includes('admin')) {
        next()
    } else {
        res.send('User khong co quyen')
    }

}

userRouter.get('/',authorizationCheck, async (req, res) => {
    const users = await userModel.find({})
    res.send(users)
})
userRouter.patch('/:username', authorizationCheck, async (req, res) => {
    const {role, song} = req.body
    const username = req.params.username
    //Tìm xem có user không -> findOne
    const user = await userModel.findOne({username})
    if(user) {
        const user = await userModel.findOneAndUpdate({username}, {$spush: {songs: song}}, {new: true})
        res.send(user)
    }else{
        res.send('Khong có user')
    }
    //Update role cho usernay -> UpdateOne

    //Gọi lại user đc update cho clients
})


userRouter.delete('/:username', authorizationCheck, async(req, res) => {
    //Lay username tu params
    const username = req.params.username
    //Check xem user có phải của user hiện tại không
    const currentUser= req.user
    if(currentUser.username === username) {
        res.status(400).send('Khong the xoa user')
        return
    }
    // Tìm xem user có trong db hay ko
    const user = await userModel.findOne({username})
    // Xóa
    if(user) {
        await userModel.findOneAndDelete({username})
        res.send('Da xoa')
    }else{
        res.send('khong co user')
    }
   
})

userRouter.get('/me', (req, res) => {
    res.send(req.user)
})

module.exports = { userRouter }