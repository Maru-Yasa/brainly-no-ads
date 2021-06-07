const express = require('express')
const app     = express()
const brainly = require('brainly-scraper-v2')
app.set('view engine','ejs')
app.use(express.urlencoded({ extended: true }))

app.route('/')
    .get((req,res) => {
        console.log(req.body)
        data = null
        res.render('index',data)
    })
    .post((req,res) => {
        console.log(req.body)
        res.redirect(`/tanya?question=${req.body.question}`)
    })

app.route('/tanya')
    .get(async (req,res) => {
        try {

            if (req.query.question) {
                question = req.query.question
                await brainly(question, 10, 'id').then(r => {
                    data = r.data
                    res.render('index',data=data)
                });        
            } else {
                res.redirect('/')
            }
    
        } catch (error) {
            res.redirect('/')
        }
    })
    .post((req,res) => {
        console.log(req.body)
        res.redirect(`/tanya?question=${req.body.question}`)
    })


app.listen(3000, () => {
    console.log('Server ok!')
})