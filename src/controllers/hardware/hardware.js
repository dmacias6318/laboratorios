const timestamp = require("time-stamp");
const pool = require("../../pgsql");
const helpers = require("../../server/helpers");
const { danny } = require("../../server/mailconfig");
const {configjwt} = require("../../keys");

const jwt = require('jsonwebtoken')

const Hardware= {};



Hardware.registrar= async (req, res) => {
    const { nombre, detalle, equipoid } = req.body;
    console.log(req.body)

    try{
        const verificaHard = await pool.query("SELECT * FROM hardware WHERE nombre=$1 and equipoid=$2",[nombre,equipoid]
    );
    
    if (verificaHard.rows.length > 0) {
      res.json({ sms: "duplicado" });
    } else {
        const result = await pool.query(
            `insert into hardware (nombre, detalle, equipoid ) values ($1,$2,$3)`,
            [
                nombre, 
                detalle, 
                equipoid
            ]
          );
        
      if (result) {
        console.log("Hardware creado");
        res.status(200).json({ 
          sms: "ok",
          mensaje:"Hardware registrado con exito",
        });
      } else {
        console.log("Hardware no creado");

        res.json({ sms: "err" });
      }

    }
    }catch(e){
       console.log(e)
    }
};





Hardware.editar= async (req, res) => {
    const { hardwareid, nombre, detalle, equipoid } = req.body;
    console.log(req.body)

    try{
        const verificaHard = await pool.query(
            "SELECT * FROM hardware WHERE hardwareid= $1",
            [hardwareid]
        );
        if (verificaHard.rows.length ==0) {
        res.json({ sms: "no existe" });
        } else {
            const result = await pool.query(
                ` update hardware set nombre=$1,detalle=$2,equipoid=$3 where hardwareid=$4`,
                [
                    nombre, 
                    detalle, 
                    equipoid,
                    hardwareid
                ]
              );
              if (result) {
                console.log("Hardware actualizado");
                const dataUser = await pool.query(
                  "SELECT * FROM hardware WHERE hardwareid= $1",
                  [hardwareid]
                );
              
                res.json({ 
                    sms: "ok",
                    nombre:dataUser.rows[0].nombre,
                    detalle:dataUser.rows[0].detalle,
                    equipoid:dataUser.rows[0].equipoid
                 });
              } else {
                console.log("Hardware no actualizado");
        
                res.json({ sms: "err" });
              }
            
        }
        
    }catch(e){
       console.log(e)
    }
        
};


Hardware.eliminar= async (req, res) => {
    const { hardwareid} = req.body;
    console.log(req.body)
    try{
        const verificaHard = await pool.query("SELECT * FROM hardware WHERE hardwareid=$1",[hardwareid]
        );
        
        if (verificaHard.rows.length == 0) {
        res.json({ sms: "no existe" });
        } else {
            const result = await pool.query(
                ` delete from hardware where hardwareid=$1`,
                [
                    hardwareid
                ]
            );
            if (result) {
            console.log("Hardware eliminado");
            res.json({ 
                sms: "Ok",
                });
            } else {
            console.log("Hardware no eliminado");
    
            res.json({ sms: "err" });
            }
        }
    }catch(e){
       console.log(e)
    }
        
};

Hardware.data= async (req, res) => {
   
    try{
        const result = await pool.query(
            "SELECT * FROM hardware WHERE hardwareid= $1 ",
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


Hardware.allData = async (req, res) => {
    try {
      const result = await pool.query("select * from hardware");
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



module.exports = Hardware;