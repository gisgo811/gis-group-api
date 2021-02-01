const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const jobsRouter = require('./routes/jobs');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.all('*', function(req, res, next) {
  //res.header("Access-Control-Allow-Origin", "http://localhost:9999");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  //res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


/*app.use( (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }else{
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(" ");
      req.token = bearer[1];
      User.verify(req.token, (err, decoded) => {
        if (err) {
          if(err.name === 'TokenExpiredError'){
              res.status(401);
              res.send('令牌已过期');
          }else{
              res.status(403);
              res.send('没有访问权限');
          }
        }
        else{
          next();
        }
      });
    } else {
      res.status(403);
      res.send('没有访问权限');
    }
  }
});*/

app.use('/users', usersRouter);
app.use('/jobs', jobsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
