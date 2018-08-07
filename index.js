const Telegraf = require('telegraf')
const express = require('express')
const expressApp = express()

const PORT = process.env.PORT || 5000;
const TOKEN = process.env.TOKEN || "XXX";
const URL = process.env.URL || 'https://pruebatelegram.herokuapp.com/';
const NODE_ENV = process.env.NODE_ENV || 'development';


// TELEGRAF
const bot = new Telegraf(TOKEN);

// TELEGRAM
const Telegram = require('telegraf/telegram');
const telegram = new Telegram(TOKEN);


var admin = require("firebase-admin");
var serviceAccount = require("./firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "XXX"
});


/*################################################################################################################################*/

if (NODE_ENV === 'production') {
  expressApp.use(bot.webhookCallback('/' + TOKEN));
  bot.telegram.setWebhook(URL + TOKEN);
}

/**********************************************************************************************************************************/


bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy'));


// INICIO DEL BOT ! 
bot.start((ctx) => {

    console.log(ctx);
    var id = ctx.update.message.from.id;

    var nombre = "";

    if (ctx.update.message.from.username != null) {
        nombre = ctx.update.message.from.username;
    }

    /* Enviamos los datos al inicio */
    enviarDatos(null, false, id, nombre);

    /* var options2 = {
      reply_markup: JSON.stringify({
        keyboard: [
          [{ text: 'Sigue a davidpookprueba3 😎 ' }],
          [{ text: 'Sigue a davidpookprueba3 😎 ' }]
        ]
      })
    };
    telegram.sendMessage("246755745", "Siga a los canales para poder participar!", options2).then((res) => {
      // // console.log("SEND sendMessage ----> ", res);
    }).catch((err) => {
      // // console.log("ERROR sendMessage ----> ", err);
    }); */

});


bot.on('text', (ctx) => {
    console.log("NUEVO text text text text text text text text text text text text text text text text text");
    console.log(ctx);
});


bot.on('new_chat_members', (ctx) => {
    console.log("NUEVO CHAT");
    console.log(ctx.message.new_chat_members);
});

bot.on('channel_post', (ctx) => {
    console.log("NUEVO channel_post channel_post channel_post channel_post channel_post channel_post channel_post channel_post channel_post");
    console.log(ctx);
});

bot.on('update_id', (ctx) => {
    console.log("NUEVO update_id update_id update_id update_id update_id update_id update_id update_id update_id update_id ");
    console.log(ctx);
});


// Respuesta a la accion del callback
bot.action("comprobar", (ctx) => {

    var id = ctx.update.callback_query.from.id;
    var nombre = "";

    console.log('-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-..-.-...-.-.-.');
    console.log(ctx);
    console.log('-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-..-.-...-.-.-.');
    // if (ctx.update.message.from.username != null) {
    //     nombre = ctx.update.message.from.username;
    // }

    var participante = true;

    // OJOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO !!
    // EL bot ha de ser admin del canal !

    var p1 = telegram.getChatMember("@davidpookprueba3", id).then((res) => {
        console.log(res);
        var salida = {
            id: "@davidpookprueba3",
            estado: true
        };
        try {
            if (res.status == "kicked" || res.status == "left") {
                // console.log(false);
                participante = false;
                salida.estado = false;
            }
        } catch (error) {
            participante = false;
            salida.estado = false;
        }
        return salida;
    }).catch((err) => {
        // console.log("ERROR p1 ----> ", err);
    });


    var p2 = telegram.getChatMember("@davidpookprueba1", id).then((res) => {
        // console.log(res);
        var salida = {
            id: "@davidpookprueba1",
            estado: true
        };
        try {
            if (res.status == "kicked" || res.status == "left") {
                // console.log(false);
                participante = false;
                salida.estado = false;
            }
        } catch (error) {
            participante = false;
            salida.estado = false;
        }
        return salida;
    }).catch((err) => {
        // console.log("ERROR p2 ----> ", err);
    });

    var p3 = telegram.getChatMember("@davidpookprueba2", id).then((res) => {
        // console.log(res);
        var salida = {
            id: "@davidpookprueba2",
            estado: true
        };
        try {
            if (res.status == "kicked" || res.status == "left") {
                // console.log(false);
                participante = false;
                salida.estado = false;
            }
        } catch (error) {
            participante = false;
            salida.estado = false;
        }
        // console.log(salida);

        return salida;
    }).catch((err) => {
        // console.log("ERROR p2 ----> ", err);
    });

	// Promise all
    Promise.all([p1, p2, p3]).then(values => {

        // console.log("participanteee! --> ", participante);
        console.log("Promise all values --> ", values);

        console.log("NUEVO 222233333 antess ");
        telegram.exportChatInviteLink("@davidpookprueba3", (ctx) => {
            console.log("NUEVO 222233333");
            console.log(ctx);
        });

		// enviar datos
        enviarDatos(values, true, id, nombre);

        if (participante == true) {

            var database = admin.database();

            var ref = database.ref("usuarios");

            // ref.set({ 1: "asdasdsa" });

            var ref = database.ref("usuarios");
            ref.once("value", function (snapshot) {
                if (snapshot.val() != null) {
                    console.log("total", snapshot.val().length);

                    var total = 0;
                    total = snapshot.val().length;

                    var ref2 = database.ref("usuarios/" + total);
                    ref2.set({
                        "id": id,
                        "nombre": nombre
                    });


                } else {
                    ref.set({
                        0: {
                            "id": id,
                            "nombre": "pendiente..."
                        }
                    });
                }

            });

            return ctx.reply('Perfecto vas a participar en el sorteo 🤩🤩🤩🤩🤩🤩🤩🤩🤩 !');
        } else {
            return ctx.reply('Por favor has de seguir todos los canales.. 😢 😢 😢 😢 😢  ');
        }


    });

})


/**
 * Enviar datos al bot 
 */
function enviarDatos(params, dinamico, id) {

    // id = 246755745;

    var options = {};
    var mensaje = "Bienvenido 🎉🎉🎉❗❗❗ \n\nSiga a los canales para poder participar ❗❗❗";

    if (dinamico == false) {

        mensaje = "Bienvenido 🎉🎉🎉❗❗❗ \n\nSiga a los canales para poder participar ❗❗❗";

        options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: 'Sigue @davidpookprueba3 😎', url: 'https://t.me/davidpookprueba3?invitedFrom=davidpook' }],
                    [{ text: 'Sigue @davidpookprueba1 😎', url: 'https://t.me/davidpookprueba1' }],
                    [{ text: 'Sigue @davidpookprueba2 😎', url: 'https://t.me/davidpookprueba2', }],
                    [{ text: 'Comprobar los datos 🤖', callback_data: 'comprobar' }]
                ]
            }
            )
        };

    } else {

        mensaje = "Siga a los canales para poder participar ❗❗❗";
        var datos = [];

        params.forEach(element => {
            if (element.estado == false) {
                element.texto = "Sigue " + element.id + " ❌";
                datos[element.id] = element;
            } else {
                element.texto = "Sigue " + element.id + " ✅";
                datos[element.id] = element;
            }
        });

        options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: datos["@davidpookprueba3"].texto, url: 'https://t.me/davidpookprueba3?invitedFrom=davidpook' }],
                    [{ text: datos["@davidpookprueba1"].texto, url: 'https://t.me/davidpookprueba1' }],
                    [{ text: datos["@davidpookprueba2"].texto, url: 'https://t.me/davidpookprueba2', }],
                    [{ text: 'Comprobar los datos 🤖', callback_data: 'comprobar' }]
                ]
            })
        };

    }

    telegram.sendMessage(id, mensaje, options).then((res) => {
        // // console.log("SEND sendMessage ----> ", res);
    }).catch((err) => {
        // console.log("ERROR sendMessage ----> ", err);
    });

}
/**********************************************************************************************************************************/




if (NODE_ENV === 'development') {
  bot.startPolling();
}

/*################################################################################################################################*/

expressApp.get('/', (req, res) => {
  res.send('Hello World!')
})

expressApp.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
})











