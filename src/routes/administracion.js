const { Router } = require("express");
const router = Router();
const multer = require("multer");
const path = require("path");

const uploadSinglePedido = multer({
  dest: path.join(__dirname, "../../public/upload/temp"),
}).single("pedido");


const {
  Auth,
  Usuarios,
  Laboratorios,
  Equipos,
  Hardware
} = require("../controllers/allcontrollers");
const Software = require("../controllers/Software/software");



module.exports = (app, autorizacion) => {


    router.post("/api/login",Auth.login)
    router.post("/api/recuperarclave",Auth.recuperarClave)

    router.post("/api/createUser",Usuarios.registrar)

    //Laboratorio
    router.post("/api/createLabr",Laboratorios.registrar)
    router.post("/api/editarLabr",Laboratorios.editar)
    router.post("/api/eliminarLabr",Laboratorios.eliminar)
    router.get("/api/dataLabr/:id",Laboratorios.data)
    router.get("/api/alldataLabr",Laboratorios.allData)

    //Equipos
    router.post("/api/createEqui",Equipos.registrar)
    router.post("/api/editarEqui",Equipos.editar)
    router.post("/api/eliminarEqui",Equipos.eliminar)
    router.get("/api/dataEqui/:id",Equipos.data)
    router.get("/api/alldataEqui",Equipos.allData)

    //Hardware
    router.post("/api/createHard",Hardware.registrar)
    router.post("/api/editarHard",Hardware.editar)
    router.post("/api/eliminarHard",Hardware.eliminar)
    router.get("/api/dataHard/:id",Hardware.data)
    router.get("/api/alldataHard/:id",Hardware.allData)

    //Software
    router.post("/api/createSoft",Software.registrar)
    router.post("/api/editarSoft",Software.editar)
    router.post("/api/eliminarSoft",Software.eliminar)
    router.get("/api/dataSoft/:id",Software.data)
    router.get("/api/alldataSoft/:id",Software.allData)




   
   
   app.use(router);
};

/*const admin = require("firebase-admin");
var serviceAccount = require("../../../extends.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://taxisystem-1510984171511.firebaseio.com/"
});
const db = admin.database();
*/