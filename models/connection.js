const mongoose = require("mongoose");

function mongoConnect(db_uri) {
  const database = mongoose.createConnection(db_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  database.on("error", (error) => {
    console.log(`connection ${this.name} ${JSON.stringify(error)}`);
    database
      .close()
      .catch(console.log(`failed to close connection ${this.name}`));
  });
  database.on("connected", function () {
    mongoose.set("debug", function (col, method, query, doc) {
      console.log(
        `MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(
          query
        )},${JSON.stringify(doc)})`
      );
    });
    console.log(`connected ${this.name}`);
  });

  database.on("disconnected", function () {
    console.log(`disconnected ${this.name}`);
  });

  return database;
}

module.exports = mongoConnect