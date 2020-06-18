const express = require("express");
const app = express();

const request = require("request");
const cheerio = require('cheerio')

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.listen(3003, () => console.log("http://localhost:3003"));

app.get("/", function (req, res) {
  request("http://vnexpress.net", (err, response, body) => {
    if (err) {
      console.log(err);
    } else {
      $ = cheerio.load(body)
      var ds = $(body).find('h3.title_news')
      console.log('ds',ds)
      res.render("trangchu", {html: ds});
    }
  });
});
