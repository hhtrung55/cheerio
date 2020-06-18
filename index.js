// Write Javascript code here
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const URL = "https://ketqua.net/";

request(URL, function (err, res, body) {
  if (err) {
    console.log(err);
  } else {
    const arr = [];
    let $ = cheerio.load(body);

    let obj = {};
    $("#result_tab_mb").each(function (index, element) {
      obj.date = $(this).find("#result_date").text();
      $(this)
        .find("tbody > tr")
        .each(function (iTr, tr) {
          if (iTr !== 10) {
            let nameResult = iTr;
            $(this)
              .find("tr > td")
              .each(function (iTd, td) {
                if (iTd == 0) {
                  nameResult = $(td).text();
                  obj[nameResult] = [];
                } else {
                  obj[nameResult].push($(td).text());
                }
              });
          }
        });
    });
    arr.push(JSON.stringify(obj));

    fs.writeFile("data.json", arr, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("success");
      }
    });
  }
});
