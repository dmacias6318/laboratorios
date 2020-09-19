const pool = require("./pgsql");

var objetoChoferesCoordenadas = {};
var coordenadasx = [];

module.exports = io => {
  io.on("connection", socket => {
    //console.log("usuario socket")
   
  });


  

  var coordenadasChoferes = async () => {
    var sql = "select * from unidades where estado=1";
    const rows = await pool.query(sql);
    if (rows.rows.length!=0) {
      for (var i = 0; i < rows.rows.length; i++) {
        var index = rows.rows[i].unidad_id;
        sql2 = `select coordenadas.latitud,coordenadas.longitud,coordenadas.unidad_id,unidades.disco,unidades.cooperativa_id from coordenadas INNER JOIN unidades on   
            coordenadas.unidad_id=unidades.unidad_id where coordenadas.unidad_id=${index} and unidades.estado=1 order by coordenadas.coordenada_id desc limit 1`;
        pool.query(sql2, async function(err, result) {
          if (err) throw err;
           if(result.rows.length!=0){
             

          
            const totales= await pool.query("select cooperativas.nombre ,(select count(*) from unidades where unidades.cooperativa_id=cooperativas.cooperativa_id) as totales from cooperativas")


              objetoChoferesCoordenadas = {
                latitud: result.rows[0].latitud,
                longitud: result.rows[0].longitud,
                unidad_id: result.rows[0].unidad_id,
                disco: result.rows[0].disco,
                cooperativa_id:result.rows[0].cooperativa_id,
                totales:totales.rows
              };

              coordenadasx.push(objetoChoferesCoordenadas);
              if (coordenadasx.length == rows.rows.length) {
                //console.log(coordenadasx)
                  io.emit("coordenadasUnidades", coordenadasx);
                  coordenadasx = [];
              }
           
           }else{
             io.emit("coordenadasUnidades", []);

           }
              
         
          
        });
      
        
      }
    }else{
      console.log("ninguna unidad activa via socket")
    }

    coordenadasChofertimer = setTimeout(coordenadasChoferes, 5000);
  };
  //===================================================================================================================================================
  //coordenadasChoferes();
  
};

//==================================================================================================================================================
//funcion para actualizar los choferes enlinea dentro del mapa
