const productManager = require("./productManager.js")
const CartModel = require('../models/cart.model.js')

class Cart{
    async createCart(productos){
        try{
            return(await CartModel.create({products: [...productos]}))
        }catch(err){
            return(err)
        }
    }

    async getCarts(){
        try{
            const carts = await CartModel.find()
            return(carts)
        }catch(err){
            console.error(err)
        }
    }

    async getCartById(id){
        const carts = await this.getCarts()
        try{
            const cart = carts.map(cart => cart.toObject({virtuals: true})).find(cart => cart.id === id)

            if(cart){
                return(cart)
            }else{
                return("Error: that cart does not exist")
            }
        }catch(err){
            return(`Err: ${err}`)
        }

        
    }

    async addProductToCart(cid, pid, quantity){
        const cart = await this.getCartById(cid)
        const newProducts = cart.products

        console.log(pid)
        const newProduct = {productId: await productManager.getProductById(pid), quantity}
        console.log(newProduct)
        if(newProduct.productId){
            newProducts.push(newProduct)
            console.log(newProducts)
        }else{
            return("Error, el producto no existe")
        }
        
        try{
            console.log(await CartModel.updateOne({_id: cid}, {$set: {products: newProducts}}))
        }catch(err){
            console.log(err)
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
          const cart = await CartModel.findByIdAndUpdate(cid, {
            $pull: { products: { productId: pid } },
          });
      
          if (!cart) {
            throw new Error('Cart not found');
          }

          return(cart)
        } catch (err) {
            return(err)
        }
      }

    async updateProductsFromCart(cid, products){
        try {
            const cart = await CartModel.findByIdAndUpdate(cid, {
              $set: {products: products},
            });
        
            if (!cart) {
              throw new Error('Cart not found');
            }
  
            return(cart)
          } catch (err) {
              return(err)
          }
    }

    async updateProductQuantity(cid, pid, newQuantity){
        try{
            const cart = await CartModel.findByIdAndUpdate(cid, {
                $pull: { products: { productId: pid } },
              });

            console.log(cart)
            const product = await CartModel.findByIdAndUpdate(cid, {
                $push: {products: {productId: pid, quantity: newQuantity}}
            })
           
            return(product)
        }catch(err){
            return err
        }
    }

    async deleteProductsFromCart(cid){
        try{
            const cart = await CartModel.findByIdAndUpdate(cid, {
                $set: {products: []}
            })
            console.log("a")
            console.log(cart)
            return(cart)
        }catch(err){
            return err
        }
    }
}

const cart = new Cart()

module.exports = cart



//Codigo para hacer post del cart:
// [
//     {
//         "productId": "660c3d464eb0ad95e8415901",
//         "quantity": 5
//     },
//     {
//         "productId": "660c84fabbe12d13695",
//         "quantity": 10
//     }
// ]


//Codigo apra insertar un producto al cart:
// http://localhost:8080/api/carts/660c577508630c15906f9564/product/660bb18539d161ae2f053b11
// {
//     "quantity": 5
// }