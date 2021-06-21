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

app.route('/api')
    .get(async (req,res) => {
        try {
            var query = req.query
            if(query.question){
                question = query.question
                server = query.server
                await brainly(question, 15, server | 'id').then(r => {
                    data = r.data
                    res.status(200).send({
                        length: data.length,
                        data : data
                    })
                })
            }else{
                res.status(200).send({
                    length:data.length,
                    data:[]
                })
            }
        } catch (error) {
            res.status(404).send({
                error:error
            })
        }
    })

app.listen(3000, () => {
    console.log('Server ok!')
})