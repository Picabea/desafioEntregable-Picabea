const { Router } = require('express')
const cart = require('../dao/dbManagers/carts.js')
const router = Router()

router.get('/:cid', (req, res) => {
    const cid = req.params.cid
    cart.getCartById(cid)
    .then(response => {
        res.render("cart",{products: response.products})
    })
})

router.post('/', async (req, res) => {
    const products = req.body
    if(products.length >= 1){
        res.send(await cart.createCart(products))
    }else{
        res.send("Envie al menos un producto")
    }
    
})

router.post('/:cid/product/:pid', (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const quantity = req.body.quantity

    cart.addProductToCart(cid, pid, quantity)
    .then(response => res.send(response))
})


router.delete('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid

    try{
        const result = await cart.deleteProductFromCart(cid, pid)
        res.status(200).json(result)
    }catch(err){
        res.status(400).send(err)
    }
})

router.delete('/:cid', async (req, res) => {
    const cid = req.params.cid

    try{
        const result = await cart.deleteProductsFromCart(cid)
        res.status(200).json(result)
    }catch(err){
        res.status(400).json(err)
    }
})

router.put('/:cid', async (req, res) => {
    const cid = req.params.cid
    const products = req.body

    try{
        const result = await cart.updateProductsFromCart(cid, products)
        res.status(200).json(result)
    }catch(err){
        res.status(400).send(err)
    }
})

router.put('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid

    const newQuantity = req.body["newQuantity"]

    try{
        const result = await cart.updateProductQuantity(cid, pid, newQuantity)
        
        res.json(result)
    }catch(err){
        res.json(err)
    }
})

module.exports = router

