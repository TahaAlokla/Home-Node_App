const express = require('express');
const createError = require('http-errors');
const multer = require('multer')
const app = express();
const path = require('path')
const session = require('express-session')
const MongoDBStoreSession = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
var logger = require('morgan');
const cors =require('cors')
const socketIO = require('socket.io')
const httpServer = require('http').createServer(app)

global.IO = socketIO(httpServer, { cors: {
  origin: '*',
}})
IO.on("connection", socket => {
  // Log whenever a user connects
  console.log("user connected");

  // Log whenever a client disconnects from our websocket server
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  // When we receive a 'message' event from our client, print out
  // the contents of that message and then echo it back to our client
  // using io.emit()
  socket.on("message", message => {
    console.log("Message Received: " + message);
    IO.emit("message", { type: "new-message", text: message });
  });
});
dotenv.config()
// ==============================================================================//
//  using  routers middleware
const userRouter = require('./routers/user.route')
const homeRouter = require('./routers/home.router')
const workerRouter=  require('./routers/worker.router')
const serviceRouter = require('./routers/service.router')
const adminRouter = require('./routers/admin.router')
const citesAvailableRouter = require('./routers/citesAvailable.router')
const QuestionsAndAnswerRouter = require('./routers/QuestionsAndAnswer.router')
// connection with database 
const option_mongoose={
    useNewUrlParser: true,
     useUnifiedTopology: true,
     useCreateIndex: true
}
mongoose.connect(process.env.DB_URL, option_mongoose).then(() => {
    console.log('successfully connection with database ');
}).catch(err => {
    console.log('error with connection to database :', err);
})
// =============================================================================//
// cors configuration 
// http://localhost:3000/
var whitelist = ['localhost:4000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
// app.use(cors(corsOptions))
app.use(cors())
// allowed  everything ! 
app.options('*',cors())
app.use(logger('dev'));
// ==================================================================================//
// static folder  
app.use('/images',express.static(path.join(__dirname, '/images')))

// for supported Json Format 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//  using  routers middleware
app.use('/api/', homeRouter)
app.use('/api/user', userRouter)
app.use('/api/worker',workerRouter)
app.use('/api/service',serviceRouter)
app.use('/api/admin',adminRouter)
app.use('/api/questions',QuestionsAndAnswerRouter)
app.use('/api/cites', citesAvailableRouter);









// app.use(function(req, res, next) {
//     next(createError(404));
//   });
  
  // error handler
//   app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
  
//     // render the error page
//     res.status(err.status || 500);
//     res.json({
//       massage:err.massage
//     });
//   });  

  
const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`App listening on port ${port}!`);
// });
httpServer.listen(port, () => {
       console.log(`App listening on port ${port}!`);
   });
