const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors')
const usersRoutes = require('../routes/users.routes');
const rolesRoutes = require('../routes/roles.routes');
const { dbConnection } = require("../database/config");


class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    //conectar a DB
    this.conectarDB()

    //middlewares
    this.middlewares()

    //rutas de mi aplicacion
    this.routes()
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

  async conectarDB() {
    await dbConnection()
  }

  routes() {
    this.app.use('/api/users', usersRoutes)
    this.app.use('/api/roles', rolesRoutes)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`API lista en el puerto ${this.port}`);
    });
  }
}

module.exports = Server;
