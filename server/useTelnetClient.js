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
              //parser.parse(data);
              process.stdout.write(d);
              io.emit("data", data);
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
      });

    connection.connect({
      host: "localhost",
      port: 23,
      // shellPrompt: "/ $#",
      timeout: 5000,
      echoLines: 0,
      stripShellPrompt: false,
    });
  });
};
exports.useTelnetClient = useTelnetClient;
