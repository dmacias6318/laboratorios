const { Router } = require("express");
const router = Router();
const timestamp = require("time-stamp");
const pool = require("../databases");
const path =require('path');
const fs=require('fs-extra');
const helpers = require("../server/helpers");
const { danny } = require("../server/mailconfig");
const Coordenadas= {};
var objetoChoferesCoordenadas = {};
var coordenadasx = [];
const {
 Auth,
 Buses,
 Paradas
} = require("../controllers/allcontrollers");

/*const admin = require("firebase-admin");
var serviceAccount = require("../../../extends.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://taxisystem-1510984171511.firebaseio.com/"
});
const db = admin.database();
*/
module.exports = (app,autorizacion) => {
  //=================================================================

 

  















  




  router.get("/api/getLineas",async (req,res)=>{
    try{
      const respuesta= await pool.query(`select * from lineas`);
      if(respuesta.length>0){
        console.log(respuesta)
        res.status(200).json({sms:"ok",respuesta})
      }else{
        res.status(200).json({sms:"nodata"})
        return;
      }
    }catch(e){
      console.log(`get lineas error :  ${e.code}`)
      res.status(404).json({"sms":"err"})
      return;
    }
  })
    
   router.get("/api/getcoordenadas",async (req,res)=>{
    try{
      var sql = "select * from unidades where estado=1";
      const rows = await pool.query(sql);
      if(rows.length>0){
          for (var i = 0; i < rows.length; i++) {
              var index = rows[i].id;
              try{
                  sql2 =`select coordenadas.latitud,coordenadas.longitud,coordenadas.unidad_id,unidades.disco,unidades.cooperativa_id from coordenadas INNER JOIN unidades on   
                  coordenadas.unidad_id=unidades.id where coordenadas.unidad_id=${index} and unidades.estado=1 order by coordenadas.id desc limit 1`;
                const result= await pool.query(sql2);
                if(result.length>0){
                  try{
                    const contarvalle= await pool.query("select count(*) as total from unidades where estado=1 and unidades.cooperativa_id=4")
                    try{
                      const contarportoviejo= await pool.query("select count(*) as total from unidades where estado=1 and unidades.cooperativa_id=6")
                      try{
                        const contarpicoaza= await pool.query("select count(*) as total from unidades where estado=1 and unidades.cooperativa_id=5")
                        objetoChoferesCoordenadas = {
                          latitud: result[0].latitud,
                          longitud: result[0].longitud,
                          unidad_id: result[0].unidad_id,
                          disco: result[0].disco,
                          cooperativa_id:result[0].cooperativa_id,
                          totalvalle:contarvalle[0].total,
                          totalpicoaza:contarpicoaza[0].total,
                          totalportoviejo:contarportoviejo[0].total
      
           
                        };
                        coordenadasx.push(objetoChoferesCoordenadas);
                        if (coordenadasx.length == rows.length) {
                          //console.log(coordenadasx);
                          res.status(200).json({sms:"ok",respuesta:coordenadasx})
                          coordenadasx=[]
                          return;
                        }
                      }catch(e){
                        console.log(`contar picoaza :  ${e.code}`)
                        res.status(404).json({"sms":"err"})
                        return;
                      }
                    }catch(e){
                      console.log(`contar portoviejo :  ${e.code}`)
                      res.status(404).json({"sms":"err"})
                      return;
                    }
                  }catch(e){
                    console.log(`Contar ciudad del valle :  ${e.code}`)
                    res.status(404).json({"sms":"err"})
                    return;
                  }
                 
                }
           
             
              }catch(e){
                console.log(`Obteniendo coordenadas :  ${e.code}`)
                res.status(404).json({"sms":"err"})
                  return;
              }
              
            }
  
      }else{
        console.log("no encontrado")
        res.status(200).json({"sms":"nodata",respuesta:[]})
        return;
      }
  }catch(e){
      console.log(`Buscando las unidades activas :  ${e.code}`)
      res.status(404).json({"sms":"err"})
       return;
    }
   })

  //------------------------------------------------------------------------------------------------------------------------

   router.post("/api/coordenadas",async (req,res)=>{
    const {latitud,longitud,unidad_id}=req.body
    try{
       const insert=await pool.query("insert into coordenadas (latitud,longitud,fecha,unidad_id) values ($1,$2,$3,$4) ",[latitud,longitud,timestamp("YYYY:MM:DD HH:mm:ss"),unidad_id])
       if(insert){
        console.log("se inserto la coordenada")
        res.status(200).json({"sms":"ok"})
        return;
       }else{
        console.log("no se pudo insertar la coordenada")
        res.status(200).json({"sms":"noinsert"})
        return;
       }
     }catch(e){
      console.log(`insertar coordenada error :  ${e.code}`)
      res.status(404).json({"sms":"err"})
      return;
 
    }
 })



 //============================================================

  router.get("/api/getrecorrido",async(req,res)=>{
     const result=await pool.query("select * from recorridos where cooperativa_id=1 and linea_id=3")
     if(result.length>0){
       console.log(result)
       res.json({result})
     }
  })





    
    app.use(router)

}