const express = require('express')
const app     = express()
const brainly = require('brainly-scraper-v2')
const wiki = require('wikipedia')
const { summary } = require('wikipedia/dist/page')
app.set('view engine','ejs')
app.use(express.urlencoded({ extended: true }))
wiki.setLang('id')
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

async function getDesc(id){
    let page = await wiki.page(id)
    let desc = await page.summary()
        desc = desc.description
    return desc
}

app.route('/api/wikipedia')
    .get(async (req,res) => {
        try{

            var query = req.query
            if (query.query){
                let wikiData = await wiki.search(query.query)
                let page = await wiki.page(217512)
                let data = []
                for(var e of wikiData.results){
                    desc = await  getDesc(e.pageid)
                    tmp = {
                        title:e.title,
                        pageId:e.pageid,
                        desc : desc
                    }
                    data.push(tmp)
                }
                return res.status(200).send({
                    data:data,
                })
            }
            return res.status(404).send({
                error:"query of null"
            })

        }catch (error) {
            console.log(error)
            return res.status(403).send({
                error:error
            })
        }
    })

app.route('/api/wikipedia/page')
    .get(async (req,res) => {
        try {
            var query = req.query
            if(query.id){
                let id = query.id
                let page = await wiki.page(id)
                let _summary = await page.summary()
                let summary = _summary.extract
                let data = {
                    title:_summary.title,
                    summary:summary,
                    thumbnail:_summary.thumbnail.source,
                    lang:_summary.lang,
                    description : _summary.description,
                    intro:await page.intro(),
                }
                return res.status(200).send({
                    data:data,
                })
            }
            return res.status(404).send({
                error:"query of null"
            })
        } catch (error) {
            res.status(403).send({
                error:error
            })
        }
    })

app.listen(3000, () => {
    console.log('Server ok!')
})