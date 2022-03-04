const express = require('express')
const cors = require('cors')
const app = express()


var session = require('express-session');
var Keycloak = require('keycloak-connect');

//ROTA PUBLICA TEM QUE FICAR ANTES DO MIDLEWARE
app.get('/public', function (req, res) {
  res.json({ message: 'public' });
});



var memoryStore = new session.MemoryStore();

let kcConfig = {
  clientId: 'nodejs-microservice',
  bearerOnly: true,
  serverUrl: 'http://localhost:8080/auth',
  realm: 'Dev',
  credenciais: {
    secret: 'xULVO6gPci5nr8ftdG6GX1jsVYIza6Py'
  }
};

let keycloak = new Keycloak({ store: memoryStore }, kcConfig);
app.use(cors())
app.use(express.json());


app.use(keycloak.middleware({
  logout: "/logout",
  admin: "/"
}));


app.get('/user', keycloak.protect('user'), function (req, res) {
  res.json({ message: 'secured' });
});

app.get('/admin', keycloak.protect('admin'), function (req, res) {
  res.json({ message: 'admin' });
});



app.listen(3000, function () {
  console.log('Started at port 3000');
});