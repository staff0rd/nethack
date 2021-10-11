const express = require("express");
const { useSshClient } = require("./useSshClient");
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
app.use("/xterm.css", express.static(require.resolve("xterm/css/xterm.css")));
app.use("/xterm.js", express.static(require.resolve("xterm")));
app.use(
  "/xterm-addon-fit.js",
  express.static(require.resolve("xterm-addon-fit"))
);

app.get("/", (req, res) => {
  res.render("index");
});

//useSshClient(io);
useTelnetClient(io);

http.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
