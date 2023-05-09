const express = require('express')
const mongoose = require('mongoose')
const { userRouter } = require('./routes/user')
const jwt = require('jsonwebtoken')
const { users, userModel } = require('./models/user')
const bcrypt = require('bcrypt')
const { songRouter } = require('./routes/song')

const app = express()

app.use(express.json())

const authenticationCheck = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, '123@lol');
    const { username } = decoded
    // Check user co trong co so du lieu khong 
    const user = await userModel.findOne({ username: username }).populate('songs').select({password: 0})
    if (user) {
        req.user = user
        next()
    } else {
        res.send('User khong ton tai')
    }
}

app.use('/users', authenticationCheck, userRouter)
app.use('/songs', authenticationCheck, songRouter)

app.get('/', (req, res) => {
    res.send('Home router')
})
app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await userModel.findOne({username})
    if(user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({username: username}, '123@lol')
        res.send({token: token})
    }else {
        res.send('Khong ton tai user')
    }
    // Tra token cho client
    
})
app.post('/register', async(req, res) => {
    const {username, password} = req.body
    //Check trungf username trong do
    // neu trungf thif khong cho tao user, neu khong thi cho tao user
    // tim user co username -> req.body.username
    const checkExits = await userModel.findOne({username})
    if(checkExits) {
        res.send('User da ton tai')
    } else {
        const salt = bcrypt.genSaltSync(10);
        const hashpassword = bcrypt.hashSync(password, salt)
        const user = await userModel.create({username, password: hashpassword, role: ['user']})
        res.send(user)
    }
    
})




app.listen(3000)
console.log('Server running')