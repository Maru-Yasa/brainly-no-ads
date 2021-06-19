const express = require('express')
const app     = express()
const brainly = require('brainly-scraper-v2')
const { query } = require('express')
app.use(express.urlencoded({ extended: true }))
require('dotenv').config()
app.route('/')
    .get(async (req,res) => {
        try {
            var query = req.query
            if(!query.question){
                data = null
                return res.status(404).send({
                    error:{
                        error_massage : "query of null"
                    },
                    status:404
                })
            }else if(query.question){
                question = query.question
                await brainly(question,10,'id').then(r => {
                    data = r.data
                    res.status(200).send({
                        status : 200,
                        data : r.data
                    })
                })
            }

        } catch (error) {
            res.status(404).send({
                error:error
            })
        }
    })

// app.route('/tanya')
//     .get(async (req,res) => {
//         try {

//             if (req.query.question) {
//                 question = req.query.question
//                 await brainly(question, 10, 'id').then(r => {
//                     data = r.data
//                     res.render('index',data=data)
//                 });        
//             } else {
//                 res.redirect('/')
//             }
    
//         } catch (error) {
//             res.redirect('/')
//         }
//     })
//     .post((req,res) => {
//         console.log(req.body)
//         res.redirect(`/tanya?question=${req.body.question}`)
//     })


app.listen(process.env.PORT | 3000, () => {
    console.log('Server ok!')
})