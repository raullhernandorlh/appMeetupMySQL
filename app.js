const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const logger = require('./utilities/logger');
const exphbs = require ('express-handlebars');

// Ficheros con los endpoints
const commentsRouter = require('./routes/comments');
const updatesRouter = require('./routes/updates');
const ratingsRouter = require('./routes/ratings');
const profilesRouter = require ('./routes/profiles');
const meetupsRouter = require('./routes/meetups');
const usersRouter = require('./routes/users');
const reservationsRouter = require('./routes/reservations');
const indexRouter = require('./routes/index');

const app = express();
app.set('views', path.join(__dirname, 'views'));

// Settings

app.engine('.hbs', exphbs({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialDir: path.join(app.get('views'),'partial'),
    extname:'.hbs'
}));
app.set('view engine','.hbs');

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routers

app.use('/reservations/',reservationsRouter);
app.use('/ratings/',ratingsRouter);
app.use('/updates/',updatesRouter);
app.use('/comments/',commentsRouter);
app.use('/profiles/',profilesRouter);
app.use('/meetups', meetupsRouter);
app.use('/users', usersRouter);
app.use(indexRouter);


app.use((req, res, next) => {
    console.log('código que se ejecuta antes de procesar el endpoint');
    next();
})

// Static Files (Especificar donde se encuentra la carpeta de los archivos estatico -- Carpeta Public)

app.use(express.static(path.join(__dirname,'public')));

// Listen Port
const port = process.env.PORT;
app.listen(port, () => logger.info('Server Running'));

module.exports = app;
