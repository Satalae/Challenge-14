//Global Const
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');

//Setting up sequelize&sessions
const sequelize = require('./config/connection.js');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

//Express/Port w/ Heroku env
const app = express();
const PORT = process.env.PORT || 3001;

//Handlebars setup
const hbs = exphbs.create({ helpers });

//
const sesh = {
    secret: 'dogmode',
    cookie: {

    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

//
app.use(session(sesh));

//Start up handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});