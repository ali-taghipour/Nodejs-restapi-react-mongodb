let io;

module.exports = {
    init: httpServer => {
       io =  require("socket.io")(httpServer, {
        cors: {
          origin: "*",
          methods: ["GET", "POST","DELETE","PUT","Patch","Options"],
          headers: ["Content-Type","Authorization"]
        }
      });
      return io;
    },
    getIO: () => {
        if(!io){
            throw new Error("Socket.io not initialized.");
        }
        return io;
    }
}