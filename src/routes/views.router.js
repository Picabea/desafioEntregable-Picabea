const { Router } = require('express')

const User = require("../dao/models/user.model.js")
const { userIsLoggedIn, userIsNotLoggedIn } = require('../middlewares/auth.middleware.js')

const router = Router()

router.get('/', (req, res) => {
    const isLoggedIn = ![null, undefined].includes(req.session.user)

    res.render('index', {
        title: 'Home',
        isLoggedIn,
        isNotLoggedIn: !isLoggedIn,
    })
})

router.get('/login', userIsNotLoggedIn, (_, res) => {
    // sólo se puede acceder si no está logueado
    res.render('login', {
        title: 'Login'
    })
})

router.get('/register', userIsNotLoggedIn, (_, res) => {
    // sólo se puede acceder si no está logueado
    res.render('register', {
        title: 'Register'
    })
})

router.get('/profile', userIsLoggedIn, async(req, res) => {
    let user;
    if(req.session.user.email === "adminCoder@coder.com"){
        user = {
            firstName: "Admin",
            lastName: "Coder",
            age: "-",
            email: "adminCoder@coder.com"
        }
    }
    
    const idFromSession = req.session.user._id

    user = await User.findOne({_id: idFromSession})
    res.render('profile', {
        title: 'My profile',
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            email: user.email
        }
    })
})

router.get('/restorePassword', userIsNotLoggedIn, (req, res) => {
    res.render('restorePassword')
})
module.exports = router