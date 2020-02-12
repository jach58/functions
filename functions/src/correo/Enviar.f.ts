import * as functions from "firebase-functions";
import * as cors from "cors";
import * as express from "express";
import * as nodemailer from "nodemailer";
import * as cookieParser from "cookie-parser";

const transportador = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: ""
  }
})


const endpointExpress = express();
const corsVal = cors({origin:true});

endpointExpress.options("*", corsVal);
endpointExpress.use(corsVal);

endpointExpress.use(cookieParser());

endpointExpress.post("*", (req, res) => {
  const _email = req.body.email;
  const _titulo = req.body.titulo;
  const _mensaje = req.body.mensaje;

  const emailOpciones = {
    from: "juancher84@gmail.com",
    to: _email,
    subject: _titulo,
    html: '<p>' + _mensaje + '</p>'
  }

  transportador.sendMail(emailOpciones, function(err, info){
    if(err){
      res.send(err);
    } else {
      res.send("El email fue enviado correctamente");
    }
  });
});

exports = module.exports = functions.https.onRequest((request, response) => {
  return endpointExpress(request, response);
});
