const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/config').get(process.env.NODE_ENV);
const app = express();
const { User } = require('./models/user')
const { Beer } = require('./models/beer')

mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE);

app.use(bodyParser.json());
app.use(cookieParser());

//GET //
app.get('/api/getBeer', (req, res)=>{
  let id = req.query.id;
  Beer.findById(id, (err,doc)=>{
    if(err) return res.status(400).send(err);
    res.send(doc)
  })
})

app.get('/api/beers', (req,res)=>{
  //localhost:3001/api/beers?skip=2&limit=1&order=asc
  let skip = parseInt(req.query.skip);
  let limit = parseInt(req.query.limit);
  let order = req.query.order;

  Beer.find().skip(skip).sort({_id:order}).limit(limit).exec((err,doc)=>{
        if(err) return res.status(400).send(err);
        res.send(doc);
  })
})


//POST //
app.post('/api/beer', (req, res)=>{
  const beer = new Beer(req.body)
  beer.save((err,doc)=>{
    if(err) return res.status(400).send(err);
    res.status(200).json({
      post:true,
      beerId: doc._id
    })
  })
})

//Update //


const port = process.env.port || 3001;
app.listen(port, ()=>{
  console.log("listening on port:", port);
})
