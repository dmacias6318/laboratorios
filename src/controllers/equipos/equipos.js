const timestamp = require("time-stamp");
const pool = require("../../pgsql");
const helpers = require("../../server/helpers");
const { danny } = require("../../server/mailconfig");
const {configjwt} = require("../../keys");



const jwt = require('jsonwebtoken')

const Equipos= {};



Equipos.registrar= async (req, res) => {
    const { numeropc, tipo, marca, fecha_adquisicion, serie, laboratorioid } = req.body;
    console.log(req.body)

    try{
        const verificaEquipo = await pool.query("SELECT * FROM equipos WHERE numeropc=$1",[numeropc]
    );
    
    if (verificaEquipo.rows.length > 0) {
      res.json({ sms: "duplicado" });
    } else {
        const result = await pool.query(
            `insert into equipos (numeropc, tipo, marca, fecha_adquisicion, serie, laboratorioid ) values ($1,$2,$3,$4,$5,$6)`,
            [
                numeropc,
                tipo, 
                marca, 
                fecha_adquisicion, 
                serie, 
                laboratorioid
            ]
          );
        
      if (result) {
        console.log("Equipo creado");
        const dataUser = await pool.query(
          "SELECT * FROM equipos WHERE numeropc= $1 ",
          [numeropc]
        );
        res.status(200).json({ 
          sms: "ok",
          mensaje:"Laboratorio registrado con exito",
          numeropc:dataUser.rows[0].numeropc,
          tipo:dataUser.rows[0].tipo,
          marca:dataUser.rows[0].marca,
          fecha_adquisicion:dataUser.rows[0].fecha_adquisicion,
          serie:dataUser.rows[0].serie,
          laboratorioid:dataUser.rows[0].laboratorioid
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


Equipos.editar= async (req, res) => {
    const {equipoid, numeropc, tipo, marca, fecha_adquisicion, serie, laboratorioid } = req.body;
    console.log(req.body)

    try{
        const verificaUser = await pool.query(
            "SELECT * FROM equipos WHERE numeropc= $1",
            [numeropc]
        );
        if (verificaUser.rows.length ==0) {
        res.json({ sms: "no existe" });
        } else {
            const result = await pool.query(
                ` update equipos set numeropc=$1,tipo=$2,marca=$3,fecha_adquisicion=$4,serie=$5,laboratorioid=$6 where equipoid=$7`,
                [
                    numeropc, 
                    tipo, 
                    marca, 
                    fecha_adquisicion, 
                    serie, 
                    laboratorioid,
                    equipoid
                ]
              );
              if (result) {
                console.log("Equipo actualizado");
                const dataUser = await pool.query(
                  "SELECT * FROM equipos WHERE equipoid= $1",
                  [equipoid]
                );
              
                res.json({ 
                    sms: "ok",
                    numeropc:dataUser.rows[0].numeropc,
                    tipo:dataUser.rows[0].tipo,
                    marca:dataUser.rows[0].marca,
                    fecha_adquisicion:dataUser.rows[0].fecha_adquisicion,
                    serie:dataUser.rows[0].serie,
                    laboratorioid:dataUser.rows[0].laboratorioid
                 });
              } else {
                console.log("Equipo no actualizado");
        
                res.json({ sms: "err" });
              }
            
        }
        
    }catch(e){
       console.log(e)
    }
        
};


Equipos.eliminar= async (req, res) => {
    const { equipoid} = req.body;
    console.log(req.body)
    try{
        const verificaEquipo = await pool.query("SELECT * FROM equipos WHERE equipoid=$1",[equipoid]
        );
        
        if (verificaEquipo.rows.length == 0) {
        res.json({ sms: "no existe" });
        } else {
            const result = await pool.query(
                ` delete from equipos where equipoid=$1`,
                [
                    equipoid
                ]
            );
            if (result) {
            console.log("Equipo eliminado");
            res.json({ 
                sms: "Ok",
                });
            } else {
            console.log("Equipo no eliminado");
    
            res.json({ sms: "err" });
            }
        }
    }catch(e){
       console.log(e)
    }
        
};

Equipos.data= async (req, res) => {
   
    try{
        const result = await pool.query(
            "SELECT * FROM equipos WHERE equipoid= $1 ",
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


Equipos.allData = async (req, res) => {
    try {
      const result = await pool.query("select * from equipos");
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






module.exports = Equipos;