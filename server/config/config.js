//production variables
const config = {
  production:{
    SECRET:process.env.SECRET,
    DATABASE:process.env.MONGODB_URI
  },
  default:{
    SECRET:'PASSWORD123',
    DATABASE:'mongodb://localhost:27017/beers'
  }
}

exports.get = function get(env){
  return config[env] || config.default
}
