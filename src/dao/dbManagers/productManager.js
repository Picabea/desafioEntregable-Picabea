const ProductModel = require('../models/product.model.js')

class ProductManager{
    constructor(){}

    async addProduct(title, description, price, thumbnail, code, stock, category){
      const validStock = !isNaN(stock) || stock >= 0
      const validPrice = !isNaN(price) || price >= 0

      if(title && description && code && stock && category && validStock && validPrice){
        try{
          return(await ProductModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status: true,
            category
          }))
        }catch(err){
          return(err)
        }
                  
      }else{
        return "Error: Invalid data"
      }
    }

    async getProducts(limit = null, page = 1, sort= null, queryField = null, queryContent = null){
      const validLimit = !isNaN(limit) && Number(limit) >= 0
      const validPage = !isNaN(page) && Number(page) >= 1

      if(!validLimit || !validPage){
        throw new Error("Pagina o limite invalidos")
      }

      const validSort = sort
      ?["asc", "desc"].includes(sort)
      :true

      let query = {}

      if(queryField){
        if(queryField === "category"){
          let validContent = ["gaseosas", "electrodomestico", "comestible"].includes(queryContent)
          if(validContent){
            query = {
              category: queryContent
            }
          }else{
            throw new Error("Contenido de la query invalido")
          }
        }else if(queryField === "disponible"){
          let validContent = !isNaN(queryContent) && queryContent >= 1

          if(validContent){
            query = {
              stock: {
                $gt: Number(queryContent)
              }
            }
          }else{
            throw new Error("Contenido de la query invalido")
          }
          
        }else{
          throw new Error("Ese campo no se puede filtrar")
        }
      }

      const aggregations = [
        {
          $match: query
        }
      ]

      const paginateOptions = {
        limit,
        page
      }

      if(validSort){
        let sortingOrder = null
        if(sort === "asc"){
          sortingOrder = 1
        }else if(sort === "desc"){
          sortingOrder = -1
        }

        if(sortingOrder){
          paginateOptions.sort = {price: sort}
        }
      }
    
    const aggregatedResults = ProductModel.aggregate(aggregations)
    
    const results = await ProductModel.aggregatePaginate(aggregatedResults, paginateOptions,
    (err, results) => {
      if(err) {
        console.error(err);
      }else {
        let limitConcat = limit
          ?`&limit=${limit}`
          :""

        let queryConcat = queryField && queryContent
          ?`&queryField=${queryField}&queryContent=${queryContent}`
          :""

        let sortConcat = sort
          ?`&sort=${sort}`
          :""

        const prevLink = results.prevPage 
          ?`http://localhost:8080/api/products?page=${results.prevPage}${limitConcat}${queryConcat}${sortConcat}`
          :null

        const nextLink = results.nextPage
          ?`http://localhost:8080/api/products?page=${results.nextPage}${limitConcat}${queryConcat}${sortConcat}`
          :null

        const data = {
            status: "success",
            payload: results.docs,
            totalPages: results.totalPages,
            prevPage: results.prevPage,
            nextPage: results.nextPage,
            page: results.page,
            hasPrevPage: results.hasPrevPage,
            hasNextPage: results.hasNextPage,
            prevLink,
            nextLink
        }
        console.log(data)
        return data;
      }
    })

    return results
  }

    async getProductById(id){
      try{
        return await ProductModel.findById(id)
      }catch (err){
        return err
      }
    }

    async updateProduct(id, newValues){
      //Keys posibles a editar
      let validKeys = ["title", "description", "price", "thumbnail", "code", "stock"]
      //Keys a editar
      let newKeys = Object.keys(newValues) 
      let valid = true

      //se controla que se esten updateando campos validos
      if(newKeys.includes("id")){
        return("Error: Id can not be modified")
      }

      newKeys.forEach((key) => {
        if(!validKeys.includes(key)){
          valid = false
        }
      })

      if(!valid){
        return console.error("Error: Enter valid keys")
      }

      try{
        return await ProductModel.updateOne({ _id: id}, {...newValues})
      }catch (err){
        return err
      }
    }

    async deleteProduct(id){
      try{
        return await ProductModel.deleteOne({_id: id})
      }catch(err){
        return err
      }
    }
  }
  
const productManager = new ProductManager(String.raw`.\test.json`)

module.exports = productManager

