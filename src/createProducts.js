const { connectToDB, closeConnection } = require('../connection')
const { faker } = require('@faker-js/faker')
const Product = require('./dao/models/product.model')

const pickRandom = arr => arr[parseInt(Math.random() * arr.length)]

const randomCategory = () => pickRandom(["gaseosas", "electrodomestico", "comestible"])

const main = async () => {
    await connectToDB('ecommerce')

    const NUM = 40

    

    for (let i = 0; i < NUM; i++) {
        const title = faker.commerce.product()
        const price = faker.commerce.price({ max: 3000 })

        const product = {
            title,
            description: faker.commerce.productDescription(),
            price,
            code: title[0] + title[1] + title[2] + price,
            stock: faker.number.int({min: 0, max: 100}),
            category: randomCategory(),
            thumbnail: `imagen.com/${title}`,
            status: true
        }
        
        console.log(product)
        await Product.create(product)
    }

    console.log('Database has been seeded!')

    await closeConnection()
}

main()
