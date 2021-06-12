const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"))

//MONGO DB
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema)

const task1 = new Item({
  name: "Bienvenido a To Do List",
})
const task2 = new Item({
  name: "Clickea el Checkbox para eliminar",
})
const task3 = new Item({
  name: "Añade nuevas tareas con el +",
})
const defaultItems = [task1, task2, task3]

const listSchema = {
  name: String,
  items: [itemsSchema]
} //para cada lista nueva, tiene Nombre y objetos del tipo item

const List = mongoose.model("List", listSchema);



app.get("/", function (req, res) {
  Item.find({} , function(err, found){
    if (found.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err){
          console.log("There was an error: " + err)
        } else {
          console.log("Success!!")
        }
      })
      res.redirect("/");
    } else {
      res.render("main", {
        listItems: found,
        listTitle: "Today"
      });
    };
  });
})

app.get("/:listName", function(req, res){
  const listName = req.params.listName;

  List.findOne({name: listName}, function(err, result){
      if (!err){
        if (result){
          res.render("main", {listTitle: listName, listItems: result.items})
        } else {
            const list = new List({
            name: listName,
            items: defaultItems
          })
          console.log("created" + listName)
          list.save()
          res.render("main", {listTitle: listName, listItems: list.items})
        }
      }
  })
})

app.post("/", function (req, res) {

  const listName = req.body.list;
  const listItem = req.body.newItem;

  const tempItem = new Item({
    name: listItem
    })

    if (listName === "Today"){
      tempItem.save();
      res.redirect("/")
    } else {
      List.findOne({name: listName}, function(err, foundList) {
        foundList.items.push(tempItem)
        foundList.save()
        res.redirect("/" + listName)
      })
    }
  });

app.post("/del", function (req, res) {
  const itemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    console.log("heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
    Item.findByIdAndRemove(itemId, function(err){
      if (!err) {
        console.log("Deleted succesfully")
        res.redirect("/");
      }
    })
  } else {
      List.findOneAndUpdate({ name: listName}, {$pull: {items: {_id: itemId}}}, function(err, foundList){
        if (!err) {
          res.redirect("/" + listName);
        }
      })
  }
})

const port = "3000";
app.listen(port, function() {
  console.log("Running server on port: " + port);
})
