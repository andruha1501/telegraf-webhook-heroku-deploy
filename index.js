const Telegraf = require('telegraf');
const express = require('express');
const expressApp = express();

const PORT = process.env.PORT || 5000;
const TOKEN = process.env.TOKEN || "XXX";
const URL = process.env.URL || 'https://pruebatelegram.herokuapp.com/';
const NODE_ENV = process.env.NODE_ENV || 'development';

// firabase
/*var admin = require("firebase-admin");
var serviceAccount = require("./firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "XXX"
});*/

                    // main code here
/*################################################################################################################################*/
const bot = new Telegraf(TOKEN);



/*################################################################################################################################*/
if (NODE_ENV === 'production') {
  expressApp.use(bot.webhookCallback('/' + TOKEN));
  bot.telegram.setWebhook(URL + TOKEN);
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











