/* Importation des modules */
const http = require('http');
const app = require('./app');

/* Fonction permettant de renvoyer un numero de port valide.
Prend un chiffre en paramétres (String ou Number) et renvoie un Number.
Si autre chose en paramétre, renvoi "False" */
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
/* Definition de la variable port grace a la fonction normalizePort ci-dessus */
const port = normalizePort(process.env.PORT || '3000');

/* Parametrage du port du serveur */
app.set('port', port);


/* Fonction permettant de rechercher les differentes erreurs et les gére de maniére appropriée.
Puis les envois au serveur */
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/* Creation du serveur */
const server = http.createServer(app);

/* Ecouteurs d'evenements */
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
