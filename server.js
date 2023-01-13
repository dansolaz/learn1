const express = require("express");
const { MongoClient } = require("mongodb");
let db;

const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

function passwordProtected(req, res, next) {
  res.set("WWW-Authenticate", "basic realm='our MERN App'");
  if (req.headers.authorization == "Basic ZGFuOmJpZ2RpY2s=") {
    console.log("wat");
    next();
  } else {
    console.log(req.headers.authorization);
    res.status(401).send("try again bitch");
  }
}

app.get("/", async (req, res) => {
  const allIdeas = await db.collection("weird_ideas").find().toArray();
  console.log(allIdeas);
  res.render("home", { allIdeas });
  //res.send(`<h1>Welcome kushim!</h1> ${allIdeas.map((idea) => `<p> ${idea.name} \n\n ${idea.time} </p>`).join("")}`);
});

app.use(passwordProtected);

app.get("/admin", passwordProtected, (req, res) => {
  res.render("admin");
});
app.get("/myideas/shitty", async (req, res) => {
  const allIdeas = await db.collection("weird_ideas").find().toArray();
  res.json(allIdeas);
});

async function start() {
  const client = new MongoClient(
    "mongodb://root:root@localhost:27017/stupid_app?&authSource=admin"
  );
  await client.connect;
  db = client.db();
  app.listen(3000);
}
start();
