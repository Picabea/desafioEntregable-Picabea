const fs = require('fs')

class Cart{
    async createCart(products){
        let carts = await this.getCarts()
        let id = await this.getId(carts)

        const cart = {
            id: id,
            products
        }
        
        if(this.validateProducts(products)){
            carts.push(cart)
            const jsonCarts = JSON.stringify(carts, null, '\t')
            await fs.promises.writeFile(String.raw`.\carts.json`, jsonCarts)
            return("success")
        }else{
            return("Error: Products are not valid!")
        }
    }
    
    validateProducts(products){
        let ids = []
        let valid = true
        products.forEach((product) => {
            if(ids.includes(product.id)){
                valid = false
            }else{
                ids.push(product.id)
            }
        })
        return(valid)
    }
    async getId(carts){
        let maxId = 0
        carts.forEach(cart => {
            if (cart.id > maxId){
                maxId = cart.id
            }
        })
        return(maxId + 1)
    }
    
    async getCarts(){
        const carts = await fs.promises.readFile(String.raw`.\carts.json`, 'utf-8')
        if(carts){
            let adaptedCarts = JSON.parse(carts)
            return(adaptedCarts)
        }else{
            return([])
        }
    }

    async getCartById(id){
        const carts = await this.getCarts()
        const cart = carts.find(cart => cart.id == id)
        if(cart){
            return(cart)
        }else{
            return("Error: that cart does not exist")
        }
    }

    async addProductToCart(cid, pid, quantity){
        const carts = await this.getCarts()
        if(carts.length >= 1){
            const cartIndex = carts.findIndex(cart => cart.id == cid)
            const cart = carts[cartIndex]
            console.log(cartIndex)
            if(cartIndex>=0){
                const newProduct = {
                    id: Number(pid),
                    quantity: quantity
                }
                const products = cart.products
                products.push(newProduct)
                if(!this.validateProducts(products)){
                    console.log("ids iguales")
                    console.log(products)
                    products.pop()
                    let productIndex = products.findIndex(prod => prod.id == pid)
                    products[productIndex].quantity = quantity
                    console.log(products)
                }
                
                fs.promises.writeFile(String.raw`.\carts.json`, JSON.stringify(carts, null, '\t'))
                return("success")
            }else{
                return("Error: That cart does not exist")
        }}else{
            return("Error: there are no carts")
        }
        
}
}

const cart = new Cart()

module.exports = cart