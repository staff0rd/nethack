const useSshClient = (io) => {
  const SSHClient = require("ssh2").Client;
  io.on("connection", function (socket) {
    var connection = new SSHClient();
    connection
      .on("ready", function () {
        socket.emit("data", "\r\n*** SSH CONNECTION ESTABLISHED ***\r\n");
        connection.shell(function (err, stream) {
          if (err)
            return socket.emit(
              "data",
              "\r\n*** SSH SHELL ERROR: " + err.message + " ***\r\n"
            );
          socket.on("data", function (data) {
            stream.write(data);
          });
          stream
            .on("data", function (d) {
              socket.emit("data", d.toString("binary"));
            })
            .on("close", function () {
              connection.end();
            });
        });
      })
      .on("close", function () {
        socket.emit("data", "\r\n*** SSH CONNECTION CLOSED ***\r\n");
      })
      .on("error", function (err) {
        socket.emit(
          "data",
          "\r\n*** SSH CONNECTION ERROR: " + err.message + " ***\r\n"
        );
      })
      .connect({
        host: "alt.org",
        port: 22,
        username: "nethack",
        password: "",
      });
  });
};
exports.useSshClient = useSshClient;
