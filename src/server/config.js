const express = require("express");
const morgan = require("morgan");
const path = require("path");
const fs =require("fs")
var cors=require("cors");
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser");
const multer=require('multer');
const rutasProtegidas = express.Router();
const config = {
	llave : "jwtclave#*./"
};

module.exports = app => {
  //configuraciones
  
  app.set("port",5001);
  app.set('llave', config.llave);
  //middlewares
  app.use(cors());
  app.use(morgan("dev"));
  //app.use(multer({dest:path.join(__dirname,'../public/upload/temp')}).single('archivo'));

  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  // required for passport
  
  app.get('/', function(req, res) {
    res.json({ message: 'recurso de entrada' });
});

//CORS Middleware
app.use(function (req, res, next) {
  //Enabling CORS 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});
 
const autorizacion=rutasProtegidas.use((req, res, next) => {
    const token = req.headers["access-token"];
   
    console.log(token)

    if (token) {
      jwt.verify(token, "jwtclave#*./", (err, decoded) => {      
        if (err) {
          return res.json({ mensaje: 'su acceso no es valido' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          mensaje: 'No tiene autorizacion' 
      });
    }
 });

  //rutas
  require("../routes/administracion")(app,autorizacion);
  require("../routes/movil")(app,autorizacion);

  return app;
};
