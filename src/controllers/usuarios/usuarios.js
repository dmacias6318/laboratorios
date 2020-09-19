const timestamp = require("time-stamp");
const pool = require("../../pgsql");
const helpers = require("../../server/helpers");
const { danny } = require("../../server/mailconfig");
const Usuarios = {};
const jwt = require('jsonwebtoken')

Usuarios.registrar = async (req, res) => {
  const { correo,clave,nombres } = req.body;
  console.log(req.body)
  const claveuser = await helpers.encryptPassword(clave);
  try {
    const verificaUser = await pool.query("SELECT * FROM usuarios WHERE correo=$1",[correo]
    );
    
    if (verificaUser.rows.length > 0) {
      res.json({ sms: "duplicado" });
    } else {
      const result = await pool.query(
        `insert into usuarios  (correo,clave,nombres) values ($1,$2,$3)`,
        [
          correo,
          claveuser,
          nombres
        ]
      );
     
      if (result) {
        console.log("usuariocreado");
        const dataUser = await pool.query(
          "SELECT * FROM usuarios WHERE usuarios.correo= $1 ",
          [correo]
        );
        const payload = {check:  true };
        const token = jwt.sign(payload, "jwtclave#*./");
        res.status(200).json({ 
          sms: "ok",
          mensaje:"Usuario registrado con exito",
          usuarioid:dataUser.rows[0].usuarioid,
          correo:dataUser.rows[0].correo,
          token:token});
      } else {
        console.log("usuario no creado");

        res.json({ sms: "err" });
      }
    }
  } catch (e) {
    console.log(e);
  }
};




Usuarios.editar = async (req, res) => {
  const { correo,nombres,apellidos,telefono,direccion,usuario_id,ciudad } = req.body;
  console.log(req.body)
  try {
    const verificaUser = await pool.query(
      "SELECT * FROM usuarios WHERE email= $1",
      [correo]
    );
    if (verificaUser.rows.length ==0) {
      res.json({ sms: "duplicado" });
    } else {
      const result = await pool.query(
        ` update usuarios set nombres=$1,apellidos=$2,telefono=$3,direccion=$4,email=$5,estado=$6,ciudad=$8 where usuario_id=$7`,
        [
          nombres,
          apellidos,
          telefono,
          direccion,
          correo,
          1,
          usuario_id,
          ciudad
        ]
      );
      if (result) {
        console.log("usuarioactualizado");
        const dataUser = await pool.query(
          "SELECT * FROM usuarios WHERE email= $1",
          [correo]
        );
      
        res.json({ 
          sms: "ok",
          usuario_id:dataUser.rows[0].usuario_id,
          email:dataUser.rows[0].email,
          estado:dataUser.rows[0].estado,
          nombres:dataUser.rows[0].nombres,
          apellidos:dataUser.rows[0].apellidos,
          direccion:dataUser.rows[0].direccion,
          ciudad:dataUser.rows[0].ciudad
         });
      } else {
        console.log("usuario noactualiado");

        res.json({ sms: "err" });
      }
    }
  } catch (e) {
    console.log(e);
  }
};


Usuarios.data = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM usuarios inner join tipo_usuario on usuarios.tipo_usuario_id=tipo_usuario.tipo_usuario_id WHERE usuarios.email= $1 ",
      [req.params.id]
    );
    if (result.rows.length > 0) {
     // console.log(result);
      res.json({ sms:"ok",result:result.rows });
    } else {
      res.json({ sms: "err" });
    }
  } catch (e) {
    console.log(e.code);
    res.json({ sms: "noconecdb" });
  }
};




Usuarios.dataiD = async (req, res) => {
  console.log(req.params.id)
  try {
    const resultado = await pool.query("SELECT * FROM usuarios inner join tipo_usuario on usuarios.tipo_usuario_id=tipo_usuario.tipo_usuario_id WHERE usuarios.usuario_id=$1 ",[req.params.id]);
    //console.log(resultado)
      res.json({ sms:"ok",result:resultado.rows[0]});
   
  } catch (e) {
    console.log(e.code);
    res.json({ sms: "noconecdb" });
  }
};

Usuarios.allData = async (req, res) => {
  try {
    const result = await pool.query("select * from usuarios");
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



Usuarios.desactivar = async (req, res) => {
  const { UsuarioID } = req.body;
  console.log(req.body);
  const result = await pool.query(
    "update usuarios set estado=0 where usuario_id = $1",
    [UsuarioID]
  );
  if (result) {
    res.json({ sms: "ok" });
  } else {
    res.json({ sms: "err" });
  }
};

Usuarios.Activar = async (req, res) => {
  const { UsuarioID, db } = req.body;
  console.log(req.body);
  try {
    const result = await pool.query(
      "update usuarios set estado=1 where usuario_id = $1",
      [UsuarioID]
    );
    if (result) {
      res.json({ sms: "ok" });
    } else {
      res.json({ sms: "err" });
    }
  } catch (e) {
    res.json({ sms: "noconecdb" });
  }
};

Usuarios.filtrarporusuarios=async(req,res)=>{
  try{
     const pedidosporusuarios= await pool.query("SELECT * FROM usuarios inner join tipo_usuario on usuarios.tipo_usuario_id=tipo_usuario.tipo_usuario_id  WHERE CONCAT(usuarios.nombres,usuarios.apellidos) LIKE '%"+req.params.usuario+"%' or usuarios.email LIKE '%"+req.params.usuario+"%'")
     res.status(200).json({"code":"success",result:pedidosporusuarios.rows})
  }catch(e){
      console.log(e)
  }
}

module.exports = Usuarios;
