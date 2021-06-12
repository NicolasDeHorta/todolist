const express = require("express");
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js");

let mainList = [];

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"))

app.get("/", function (req, res) {
  res.render("main", {
    mainList: mainList,
    todayNum: date.getDayNum(),
    todayName: date.getDayName(),
    todayMonthName: date.getMonthName()
  });
})

app.post("/", function (req, res) {
  if (req.body.newItem){
    mainList.push(req.body.newItem)
    res.redirect("/")
  }
})


const port = "3000";
app.listen(port, function() {
  console.log("Running server on port: " + port);
})
