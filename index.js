const express = require("express");
const { APP_PORT } = require("./config");
const bodyParser = require("body-parser");
const path = require('path');
const { createServer } = require('node:http');
const { connectToMongoDB } = require("./config/dbConnection");
const cors = require("cors");
const router = require("./routes");
const app = express();
// const {Server} = require('socket.io')
app.use(cors());

connectToMongoDB();


// const server = createServer(app)
// const io = new Server(server)
const http = require('http').Server(app);
const socketIO = require('socket.io')(http, {
  cors: {
      origin: "http://localhost:3000"
  }
});
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));



socketIO.on('connection', (socket) => {
  console.log(`: ${socket.id} user just connected!`);
  socket.on('message',(data)=>{
    console.log("Message data", data)
    socketIO.emit("messageResponse", data)
  } )

  socket.on('disconnect', () => {
    console.log(': A user disconnected');
  });
});
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/chat', async(req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
app.get("/", (req, res) => {
  res.send(`The app is running on port ${APP_PORT}`);
});
app.use("/api", router);

// app.listen(APP_PORT || 8000, () => {
//   console.log(`The app is running on port ${APP_PORT}`);
// });
http.listen(8080, () => {
  console.log(`Server listening on 8080`);
});