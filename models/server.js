const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors')
const usersRoutes = require('../routes/users.routes')


class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    

    //middlewares
    this.middlewares();

    //rutas de mi aplicacion
    this.routes();
  }

  middlewares() {
    //directorio public
    this.app.use(express.static("public"));

    this.app.use(cors())
    this.app.use(express.json());
    this.app.use(
      bodyParser.json({
        limit: "20mb",
      })
    );
    this.app.use(
      bodyParser.urlencoded({
        limit: "20mb",
        extended: true,
      })
    );
  }

  routes() {
    this.app.use('/api/users', usersRoutes)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`API lista en el puerto ${this.port}`);
    });
  }
}

module.exports = Server;
