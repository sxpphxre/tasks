const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const doTheStuff = require("./models/doTheStuff");

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("Connected to db!");
  app.listen(3000, () => console.log("Running at http://localhost:3000"));
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  doTheStuff.find({}, (err, tasks) => {
    res.render("todo.ejs", { doTheStuff: tasks });
  });
});

app.post("/", async (req, res) => {
  const doTheStuff = new doTheStuff({
    content: req.body.content,
  });
  try {
    await doTheStuff.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    doTheStuff.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { doTheStuffs: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    doTheStuff.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  doTheStuff.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});
