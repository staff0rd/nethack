const AnsiParser = require("node-ansiparser");
const showHidden = false;
const terminal = {
  inst_p: function (s) {
    console.log("print", s);
  },
  inst_o: function (s) {
    showHidden && console.log("osc", s);
  },
  inst_x: function (flag) {
    showHidden && console.log("execute", flag.charCodeAt(0));
  },
  inst_c: function (collected, params, flag) {
    showHidden && console.log("csi", collected, params, flag);
  },
  inst_e: function (collected, flag) {
    showHidden && console.log("esc", collected, flag);
  },
  inst_H: function (collected, params, flag) {
    showHidden && console.log("dcs-Hook", collected, params, flag);
  },
  inst_P: function (dcs) {
    showHidden && console.log("dcs-Put", dcs);
  },
  inst_U: function () {
    showHidden && console.log("dcs-Unhook");
  },
};
const parser = new AnsiParser(terminal);

const useTelnetClient = (io) => {
  const Telnet = require("telnet-client");
  io.on("connection", function (socket) {
    const connection = new Telnet();
    connection
      .on("ready", function () {
        socket.emit("conn", "\r\n*** TELNET CONNECTION ESTABLISHED ***\r\n");
        connection.shell(function (err, stream) {
          if (err)
            return socket.emit(
              "conn",
              "\r\n*** TELNET SHELL ERROR: " + err.message + " ***\r\n"
            );
          socket.on("data", function (data) {
            stream.write(data);
          });
          stream
            .on("data", function (d) {
              const data = d.toString("binary");
              socket.emit("data", data);
              parser.parse(data);
            })
            .on("close", function () {
              connection.end();
            });
        });
      })
      .on("close", function () {
        socket.emit("conn", "\r\n*** TELNET CONNECTION CLOSED ***\r\n");
      })
      .on("timeout", function () {
        socket.emit("conn", "\r\n*** TELNET CONNECTION TIMEOUT ***\r\n");
      })
      .on("error", function (err) {
        socket.emit(
          "conn",
          "\r\n*** TELNET CONNECTION ERROR: " + err.message + " ***\r\n"
        );
      })
      .connect({
        host: "localhost",
        port: 23,
        // shellPrompt: "/ $#",
        timeout: 5000,
      });
  });
};
exports.useTelnetClient = useTelnetClient;
