const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.render('chat', {
        useWS: true,
        useSA: true,
        scripts: ["chat.js"]
    })
})


module.exports = router