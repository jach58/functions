import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as cors from "cors";
import * as express from "express";
import * as cookieParser from "cookie-parser";

if(!admin.apps.length){
  admin.initializeApp();
}
const messaging = admin.messaging();

const endpointExpress = express();
const corsVal = cors({origin:true});

endpointExpress.options("*", corsVal);
endpointExpress.use(corsVal);

endpointExpress.use(cookieParser());

endpointExpress.post("*", async(req, res) => {
  try {
    const _notificationToken = req.body.token;

    const options = {
      priority: "high",
      timeTolive: 60*60*24
    }

    const payload = {
      notification: {
        title: "Saludos de Square",
        body: "Enviando Push Notifications, desde el curso"
      },
      data: {
        adicionalVaxi: "Este es un contenido extra",
        adicionalDrez: "Este es otro contenido extra para la notificación"
      }
    }

    if(_notificationToken && _notificationToken.length){
      const respuesta = await messaging.sendToDevice(_notificationToken, payload, options)

      res.status(200);
      res.send({status: "success", mensaje: "la notificación se envió correctamente", detalle: respuesta});
    } else {
      res.status(200);
      res.send({status: "", mensaje: "Este usuario no tiene token"})
    }

  }catch(e){
    res.status(401);
    res.send(e);
  }
});

exports = module.exports = functions.https.onRequest((request, response) => {
  return endpointExpress(request, response);
} )