const { Router } = require('express')

const User = require("../dao/models/user.model.js")

const router = Router()

router.post('/login', async(req, res) => {
    console.log(req.body)
    // TODO: implementar!
    const {email, password} = req.body

    if(!email || !password){
        return res.status(401).json({error: "Invalid request data"})
    }

    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
        req.session.user = {email, _id: "admin"}
        return res.redirect('/api/products/')
    }

    // Verificar que el usuario y contraseña estenm correctos
    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({error:'User not found'})
    }
    if(user.password !== password){
        return res.status(400).json({error: "Invalid password"})
    }

    // 2. crear nueva sesión si el usuario existe
    req.session.user = {email, _id: user._id.toString()}
    res.redirect('/api/products/')
})

router.post('/register', async (req, res) => {
    console.log(req.body)
    // TODO: implementar!
    try{
        const { firstName, lastName, age, email, password } = req.body
        if(!firstName || !lastName || !age || !email || !password){
            return res.status(401).json({error: "Invalid request data"})
        }
        const user = await User.create({
            firstName,
            lastName,
            age: +age,
            email,
            password,
            role: "user"
        })

        req.session.user = { email, _id: user._id.toString()}
        res.redirect('/')
    }catch(err){
        return res.status(500).json({error: err})
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(_ => {
        res.redirect('/login')
    })
})

module.exports = router