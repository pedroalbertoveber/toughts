/* external modules */
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

/* setup */
const app = express();
const conn = require("./db/conn");

/* models */
const Tought = require("./models/Tought");
const User = require("./models/User");

/* import routes */
const toughtsRoutes = require("./routes/toughtsRoutes");
const authRoutes = require("./routes/authRoutes");

/* import controller */
const ToughtsController = require("./controllers/ToughtsController");

/* handle-bars config */
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

/* get body response */
app.use(express.urlencoded({
    extended: true,
  }),
);

app.use(express.json());

/* session middleware */
app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 360000000,
      expires: new Date(Date.now() + 360000000),
      httpOnly: true,
    },
  }),
);

/* flash messages */
app.use(flash());

/* public path */
app.use(express.static("public"));

/* set session to res */
app.use((req, res, next) => {

  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

/* routes */
app.use("/toughts", toughtsRoutes);
app.use("/", authRoutes);

app.get("/", ToughtsController.showToughts);

/* initilization */
conn.sync()
.then(() => {
  app.listen(3000);
})
.catch(err => console.log(err));