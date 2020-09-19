const timestamp = require("time-stamp");
const pool = require("../../pgsql");
const helpers = require("../../server/helpers");
const { danny } = require("../../server/mailconfig");
const {configjwt} = require("../../keys");
const nodemailer = require('nodemailer')



const jwt = require('jsonwebtoken')

const Auth= {};



Auth.login = async (req, res) => {
    const {correo}=req.body
    console.log(req.body)
    try{
      const validauser=await pool.query('SELECT * FROM usuarios WHERE correo= $1',[correo])    
      if(validauser.rows.length>0){
        const password=await helpers.matchPassword(req.body.clave,validauser.rows[0].clave)
         if(password){
            const payload = {check:  true };
            const token = jwt.sign(payload, "jwtclave#*./");
            res.json({
              sms: 'ok',
              token: token,
              usuarioid:validauser.rows[0].usuarioid,
              correo:validauser.rows[0].correo,
              nombres:validauser.rows[0].nombres,
            });
          
          
         }else{
          console.log("nopass")
           res.json({sms:"nopass",mensaje:"La contraseña es incorrecta."})
         }
        
      }else{
        console.log("nouser")
        res.json({sms:"nouser",mensaje:"El usuario es incorrecto."})
      }
    }catch(e){
      console.log(e)
      res.json({sms:"noconecdb",mensaje:"Problemas con la base de datos."})
    }
       
        
};

Auth.loginConductor= async (req,res)=>{
   
}

Auth.coordenadas= async (req,res)=>{
   const {latitud,longitud,unidad_id}=req.body
   try{
      const insert=await pool.query("insert into coordenadas set latitud=?,longitud=?,fecha=?,unidad_id=? ",[latitud,longitud,timestamp("YYYY:MM:DD HH:mm:ss"),unidad_id])
      if(insert){
        console.log("ok")
      }else{
        console.log("error")
      }
    }catch(e){

      console.log(e)

   }
}



Auth.recuperarClave = async(req,res)=>{

  const {email}=req.body
  console.log(req.body)
  const code = await helpers.randomCode()
  const clavenueva =await helpers.encryptPassword(code);

  try{

  const verificaUsuario = await pool.query("select * from usuarios where email=$1",[email ])
  if(verificaUsuario.rows.length>0){
    const updateUser = await pool.query(" update usuarios set clave=$1  where email=$2",[clavenueva,email])
    if(updateUser){

      const transporter = nodemailer.createTransport({
        service:"gmail",// true for 465, false for other ports
        auth: {
          user: 'ecuimportsoporte@gmail.com',
          pass: 'Ecu2020.'
        },
    });
    
       var mailOption = { 
        from: '"Recuperacion de contraseña" <ecuimportsoporte@gmail.com>', // sender address
        to: `${email}`, // list of receivers
        subject: "Recuperar Cuenta ✔", // Subject line
        text: "?", // plain text body
        html: `<b>Se a generado una nueva contraseña : ${code} </b>`, // html body
       }
    
    
       transporter.sendMail(mailOption,(error,info)=>{ 
         if(error) { 
           console.log("error al enviar",error)
         }else{ 
           console.log("email enviado")
           res.status(200).json({sms:"Se actualizo correctamente su contraseña, revise su correo electronico"})
         }
       })

    }
       
  }else{
    res.status(200).json({sms:"El correo no existe"})
  }


  }catch(e){
    console.log(e)
  }


}




module.exports = Auth;