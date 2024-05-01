const { Router } = require('express')

const User = require("../dao/models/user.model.js")
const { hashPassword, isValidPassword } = require('../utils/hashing.js')

const passport = require('passport')

const router = Router()

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/failLogin'}), (req, res) => {
    
    // Crear sesion
    req.session.user = {email: req.user.email, _id: req.user._id.toString()}
    res.redirect('/api/products/')
})

router.post('/register', passport.authenticate('register', {failureRedirect: '/failRegister'}), (req, res) => {
        res.redirect('/')
})

router.get('/failRegister', (_, res) => {
    res.send('Error registering user!')
})

router.get('/failLogin', (_, res) => {
    res.send('Error logging in user')
})

router.get('/logout', (req, res) => {
    req.session.destroy(_ => {
        res.redirect('/login')
    })
})

router.post("/restorePassword", async (req, res) => {
    console.log(req.body)
    
    const { email, newPassword } = req.body
    try{
        const user = await User.findOneAndUpdate({email}, {password: hashPassword(newPassword)})
        if(user){
            res.status(200).redirect('/')
        }else{
            res.status(400).json({success: false})
        }
    }catch(err){
        res.status(400).json({error: err})
    }  
})

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), (req, res) => {}, )

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/'}), (req, res) => {
    console.log(req.user)
    req.session.user = { _id: req.user._id}
    res.redirect('/')
})

module.exports = router