var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var chargingRouter = require('./routes/charging/index'); // 充电桩项目api


var app = express();

// 跨域解决,在app.js中引入模块
var cors = require('cors')
// 解决跨域(建议将此项配置放在所有app.use()的最上方)
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 批量注册 充电桩项目的所有api
for (const key in chargingRouter) {
  if (Object.hasOwnProperty.call(chargingRouter, key)) {
    const chargeRouter = chargingRouter[key];
    app.use('/charging', chargeRouter);
  }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
