const timestamp = require("time-stamp");
const pool = require("../../pgsql");
const helpers = require("../../server/helpers");
const { danny } = require("../../server/mailconfig");
const {configjwt} = require("../../keys");

const jwt = require('jsonwebtoken')

const Laboratorios= {};


Laboratorios.registrar= async (req, res) => {
    const { nombre,usuarioid } = req.body;
    console.log(req.body)
    try{
        const verificaLab = await pool.query("SELECT * FROM laboratorios WHERE nombre=$1",[nombre]
    );
    
    if (verificaLab.rows.length > 0) {
      res.json({ sms: "duplicado" });
    } else {
        const result = await pool.query(
            `insert into laboratorios (nombre,usuarioid) values ($1,$2)`,
            [
              nombre,
              usuarioid
            ]
          );
        
      if (result) {
        console.log("laboratoriocreado");
        const dataUser = await pool.query(
          "SELECT * FROM laboratorios WHERE laboratorios.nombre= $1 ",
          [nombre]
        );
        res.status(200).json({ 
          sms: "ok",
          mensaje:"Laboratorio registrado con exito",
          nombre:dataUser.rows[0].nombre,
          usuarioid:dataUser.rows[0].usuarioid
        });
      } else {
        console.log("Laboratorio no creado");

        res.json({ sms: "err" });
      }
    
    }

    }catch(e){
       console.log(e)
    }
        
};


Laboratorios.editar= async (req, res) => {
    const { laboratorioid, nombre} = req.body;
    console.log(req.body)
    try{
        const verificaLab = await pool.query("SELECT * FROM laboratorios WHERE laboratorioid=$1",[laboratorioid]
    );
    
    if (verificaLab.rows.length == 0) {
      res.json({ sms: "no existe" });
    } else {
        const result = await pool.query(
            ` update laboratorios set nombre=$1 where laboratorioid=$2`,
            [
                nombre,
                laboratorioid
            ]
        );
        if (result) {
        console.log("Laboratorio actualizado");
        const dataUser = await pool.query(
            "SELECT * FROM laboratorios WHERE laboratorioid= $1",
            [laboratorioid]
        );
        
        res.json({ 
            sms: "ok",
            laboratorioid:dataUser.rows[0].laboratorioid,
            nombre:dataUser.rows[0].nombre,
            usuarioid:dataUser.rows[0].usuarioid,
            });
        } else {
        console.log("Laboratorio no actualizado");

        res.json({ sms: "err" });
        }

    }
    }catch(e){
       console.log(e)
    }
        
};


Laboratorios.eliminar= async (req, res) => {
    const { laboratorioid} = req.body;
    console.log(req.body)
    try{
        const verificaLab = await pool.query("SELECT * FROM laboratorios WHERE laboratorioid=$1",[laboratorioid]
    );
    
    if (verificaLab.rows.length == 0) {
      res.json({ sms: "no existe" });
    } else {
        const result = await pool.query(
            ` delete from laboratorios where laboratorioid=$1`,
            [
                laboratorioid
            ]
        );
        if (result) {
        console.log("Laboratorio eliminado");
        res.json({ 
            sms: "Ok",
            });
        } else {
        console.log("Laboratorio no eliminado");

        res.json({ sms: "err" });
        }

    }
    }catch(e){
       console.log(e)
    }
        
};



Laboratorios.data= async (req, res) => {
   
    try{
        const result = await pool.query(
            "SELECT * FROM laboratorios WHERE laboratorioid= $1 ",
            [req.params.id]
            );

            if (result.rows.length > 0) {
                // console.log(result);
                 res.json({ sms:"ok",result:result.rows });
               } else {
                 res.json({ sms: "err" });
               }
    }catch(e){
       console.log(e)
    }
        
};


Laboratorios.allData = async (req, res) => {
    try {
      const result = await pool.query("select * from laboratorios");
      if (result.rows.length > 0) {
        //console.log(result);
        res.json({ resultado:result.rows,sms:"ok" });
      } else {
        res.json({ sms: "err" });
      }
    } catch (e) {
      console.log(e.code);
      res.json({ sms: "noconecdb" });
    }
  };




module.exports = Laboratorios;

