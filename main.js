require('dotenv').config()
const express = require('express')
const app = express()
const qrcode = require('./qrcode')
const fs = require('fs')
const cors = require('cors')
const path= require('path')


app.use(cors())
app.use(express.json())



app.get('/', (req,res) => {
    res.send("App")
})

app.post('/getQR', async (req,res) => { 
console.log(`req body: ${req.body}`)
const url = await qrcode(req.body)
res.send(url) 
})



app.get('/download', (req,res) => {
    
    res.sendFile(req.body.imgUrl)
})


app.get('showImage', (req, res) => {
res.sendFile('./temp/ige.png')
})

app.listen(process.env.PORT,() =>{
console.log('server is running')
})