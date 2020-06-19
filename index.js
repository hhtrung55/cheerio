// Write Javascript code here
const request = require("request");
const cheerio = require("cheerio");
const moment = require("moment");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
db.defaults({ results: [] }).write();

const URL = "https://ketqua.net/xo-so-truyen-thong.php?ngay=";
const requestFunc = (url, date) => {
  let findResult = db.get("results").find({ date }).value();
  if (findResult) return null;
  request(url + date, function (err, res, body) {
    if (err) {
      console.log(err);
    } else {
      const arr = [];
      let $ = cheerio.load(body);
      let obj = { date };
      $("#result_tab_mb").each(function (index, element) {
        const date = $(this).find("#result_date").text();
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
                    if (!nameResult) {
                      let keyArr = Object.keys(obj);
                      nameResult = [keyArr.slice(-1)[0]];
                    } else {
                      obj[nameResult] = [];
                    }
                  } else {
                    obj[nameResult].push($(td).text());
                  }
                });
            }
          });
      });
      db.get("results").push(obj).write();
      console.log("DONE ", date);
    }
  });
};

for (let i = 0; i < 100; i++) {
  let timeout = setTimeout(() => {
    let str = moment().subtract(i, "days").format("DD-MM-YYYY");
    requestFunc(URL, str);
  }, 1500);
}
