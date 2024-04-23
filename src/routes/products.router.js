const { Router } = require('express')
const productManager = require('../dao/dbManagers/productManager.js')

const UserModel = require('../dao/models/user.model.js')

const router = Router()

router.get('/', async (req, res) => {
    try{
        let limit = req.query.limit
        ?req.query.limit
        :10
        let page = req.query.page
        let sort = req.query.sort
        let queryField = req.query.queryField
        let queryContent = req.query.queryContent
        let data = await productManager.getProducts(limit, page, sort, queryField, queryContent)

        const userEmail = req.session.user.email

        let user;
        
        user = await UserModel.findOne({email: userEmail}).lean()

        if(userEmail === "adminCoder@coder.com"){
            user = {
                firstName: "Admin",
                lastName: "Coder",
                age: "-",
                email: "adminCoder@coder.com"
            }
        }
        console.log(user)
        res.status(200).render('home', {response: data,
        scripts: ["products.js"],
        useWS: true,
        user})
    }catch(err){
        console.log(err)
        res.status(400).json({success: "error"})
    }
    
})

router.get('/realtimeproducts', (_, res) => {
    res.render('realTimeProducts', {
        useWS: true,
        scripts: [
            "realTimeProducts.js"
        ]
    })
})


router.get('/:pid', async (req, res) => {
    let productId = req.params.pid
    let product = await productManager.getProductById(productId)

    res.send(product)
    
})

router.post('/', (req, res) => {
    const info = req.body
    const { title, description, price, thumbnail, code, stock, category } = info

    productManager.addProduct(title, description, price, thumbnail, code, stock, category)
    .then(response => res.send(response))

})

router.delete('/:pid', (req, res) => {
    let id = req.params.pid

    productManager.deleteProduct(id)
    .then(response => res.send(response))
})

router.put('/:pid', (req, res) => {
    let id = req.params.pid
    productManager.updateProduct(id, req.body)
    .then(response => res.send(response))
})

module.exports = router

