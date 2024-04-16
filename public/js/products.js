const socket = io()

const buttons = document.querySelectorAll("button")

for(const button of buttons){
    button.addEventListener("click", async() => {
        const productId = button.id.slice(7)
        let product = {
            productId,
            quantity: 1
        }
        const cart = hasCart()
        console.log(productId)
        if(cart){
            socket.emit("addProductToCart", {
                cid: localStorage.getItem("cart"), 
                pid: productId
        })
        }else{
            socket.emit("createCart", [product])
        }
    })
}



function hasCart(){
    const cart = localStorage.getItem("cart")
    
    if(cart){
        return true
    }else{
        return false
    }
}

socket.on("result", (result) => {
    localStorage.setItem("cart", result._id)
})

socket.on("resultAddProductToCart", (result) => {
    console.log(result)
})

socket.on("error", (err) => {
    console.log(err)
})