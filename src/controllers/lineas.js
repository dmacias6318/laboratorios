const timestamp = require("time-stamp");
const pool = require("../pgsql");
const helpers = require("../server/helpers");
const { danny } = require("../server/mailconfig");
const {configjwt} = require("../keys");



const jwt = require('jsonwebtoken')

const Lineas= {};




Lineas.crear= async (req, res) => {
   
    try{
        
    }catch(e){
       console.log(e)
    }
        
};



Lineas.editar= async (req, res) => {
   
    try{
        
    }catch(e){
       console.log(e)
    }
        
};




Lineas.eliminar= async (req, res) => {
   
    try{
        
    }catch(e){
       console.log(e)
    }
        
};


Lineas.DataLineaCoop= async (req, res) => {
   
    try{

        const result = await pool.query("select l.linea_id,l.linea from lineas as l inner join cooperativa_lineas as cl on l.linea_id=cl.linea_id inner join cooperativas as c on c.cooperativa_id=cl.cooperativa_id where c.cooperativa_id=$1",[req.params.idcoop])
        console.log(result.rows)
        res.status(200).json({code:"success",respuesta:result.rows})
    }catch(e){
       console.log(e)
       res.status(200).json({code:"err",mensaje:"no se pudo realizar la consulta"})

    }
        
};




module.exports = Lineas;