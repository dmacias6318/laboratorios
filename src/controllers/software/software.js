const timestamp = require("time-stamp");
const pool = require("../../pgsql");
const helpers = require("../../server/helpers");
const { danny } = require("../../server/mailconfig");
const {configjwt} = require("../../keys");

const jwt = require('jsonwebtoken')

const Software= {};



Software.registrar= async (req, res) => {
    const { categoria, nombre, version, licencia, equipoid } = req.body;
    console.log(req.body)

    try{
        const verificaSoft = await pool.query("SELECT * FROM software WHERE categoria=$1 and equipoid=$2",[categoria,equipoid]
    );
    
    if (verificaSoft.rows.length > 0) {
      res.json({ sms: "duplicado" });
    } else {
        const result = await pool.query(
            `insert into software (categoria, nombre, version, licencia, equipoid ) values ($1,$2,$3,$4,$5)`,
            [
                categoria,
                nombre, 
                version, 
                licencia, 
                equipoid
            ]
          );
        
      if (result) {
        console.log("Software creado");
        
        res.status(200).json({ 
          sms: "ok",
          mensaje:"Software registrado con exito"
        });
      } else {
        console.log("Software no creado");

        res.json({ sms: "err" });
      }

    }
    }catch(e){
       console.log(e)
    }
};


Software.editar= async (req, res) => {
    const { softwareid, categoria, nombre, version, licencia, equipoid } = req.body;
    console.log(req.body)

    try{
        const verificaSoft = await pool.query(
            "SELECT * FROM software WHERE softwareid= $1",
            [softwareid]
        );
        if (verificaSoft.rows.length ==0) {
        res.json({ sms: "no existe" });
        } else {
            const result = await pool.query(
                ` update software set categoria=$1,nombre=$2,version=$3,licencia=$4,equipoid=$5 where softwareid=$6`,
                [
                    categoria,
                    nombre, 
                    version, 
                    licencia,
                    equipoid,
                    softwareid
                ]
              );
              if (result) {
                console.log("Software actualizado");
                const dataUser = await pool.query(
                  "SELECT * FROM software WHERE softwareid= $1",
                  [softwareid]
                );
              
                res.json({ 
                    sms: "ok",
                    categoria:dataUser.rows[0].categoria,
                    nombre:dataUser.rows[0].nombre,
                    version:dataUser.rows[0].version,
                    licencia:dataUser.rows[0].licencia,
                    equipoid:dataUser.rows[0].equipoid
                 });
              } else {
                console.log("Software no actualizado");
        
                res.json({ sms: "err" });
              }
            
        }
        
    }catch(e){
       console.log(e)
    }
        
};


Software.eliminar= async (req, res) => {
    const { softwareid} = req.body;
    console.log(req.body)
    try{
        const verificaSoft = await pool.query("SELECT * FROM software WHERE softwareid=$1",[softwareid]
        );
        
        if (verificaSoft.rows.length == 0) {
        res.json({ sms: "no existe" });
        } else {
            const result = await pool.query(
                ` delete from software where softwareid=$1`,
                [
                    softwareid
                ]
            );
            if (result) {
            console.log("software eliminado");
            res.json({ 
                sms: "Ok",
                });
            } else {
            console.log("software no eliminado");
    
            res.json({ sms: "err" });
            }
        }
    }catch(e){
       console.log(e)
    }
        
};




Software.data= async (req, res) => {
   
    try{
        const result = await pool.query(
            "SELECT * FROM software WHERE softwareid= $1 ",
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


Software.allData = async (req, res) => {
    try {
      const result = await pool.query("select * from software where equipoid=$1",[req.params.id]);
      
        res.json({ resultado:result.rows,sms:"ok" });
      
    } catch (e) {
      console.log(e.code);
      res.json({ sms: "noconecdb" });
    }
  };






module.exports = Software;