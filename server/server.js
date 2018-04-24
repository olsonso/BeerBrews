const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/config').get(process.env.NODE_ENV);
const app = express();
const { User } = require('./models/user');
const { Beer } = require('./models/beer');
const { auth } = require('./middleware/auth');

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

app.get('/api/users', (req, res)=>{
  User.find({}, (err, users) =>{
    res.status(200).send(users);
  })
})

app.get('/api/user_breweries', (req,res) =>{
  Beer.find({ownerId:req.query.user}).exec((err, docs)=>{
    if(err) return res.status(400).send(err);
    res.send(docs);
  })
})

app.get('/api/logout', auth, (err, res)=>{
  req.user.deleteToken(req.token, (err, user)=>{
    if(err) return res.status(400).send(err);
    res.sendStatus(200)
  })
})

app.get('/api/auth', auth, (req, res)=>{
  res.json({
    isAuth:true,
    id:req.user._id,
    email:req.user.email,
    name:req.user.name,
    lastname:req.user.lastname
    })
})

//POST //
app.post('/api/beer', (req, res)=>{
  const beer = new Beer(req.body);
  beer.save((err,doc)=>{
    if(err) return res.status(400).send(err);
    res.status(200).json({
      post:true,
      beerId: doc._id
    })
  })
})

app.post('/api/register', (req, res)=>{
  const user = new User(req.body);
  user.save((err,doc)=>{
    if(err) {
      console.log(err)
     return res.json({success:false});
   }
    res.status(200).json({
      success:true,
      user: doc
    })
  })
})

app.post('/api/login', (req, res)=>{
  User.findOne({'email':req.body.email}, (err,user)=>{
    if(!user) return res.json({isAuth:false, message:"user not found"})
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) return res.json({
        isAuth:false,
        message:"Wrong password"
      });
      user.generateToken((err,user) =>{
        if(err){
         return res.status(400).send(err);
       }
        res.cookie('auth', user.token).json({
          isAuth: true,
          id:user._id,
          email:user.email
        })
      })
    })
  })
})


//Update & Delete TODO //


const port = process.env.port || 3001;
app.listen(port, ()=>{
  console.log("listening on port:", port);
})
