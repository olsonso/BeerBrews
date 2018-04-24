const { User } = require('./../models/user');

let auth = (req, res, next) =>{
    let token = req.cookies.auth;

    User.findByToken(token, (err, user)=>{
      if(err) {
        console.log(err);
        throw err;
      }
      if(!user) {
        console.log(user);
        return res.json({
        error:true
      });
    }
      req.token = token;
      req.user = user;
      next();
    })
}

module.exports = {auth}
