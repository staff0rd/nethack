const express = require("express");
const { useTelnetClient } = require("./useTelnetClient");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
app.set("view engine", "ejs");
app.use(
  express.urlencoded({
    extended: false,
    limit: "150mb",
  })
);
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index");
});

useTelnetClient(io);

http.listen(3001, () => {
  console.clear();
  console.log("Listening on http://localhost:3001");
});
