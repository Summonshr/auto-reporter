var cron = require("node-cron");
var fs = require("fs");
var json2xls = require("json2xls");
var mail = require("./mail");
function caller(dir) {
  if (!fs.existsSync("./sqls/" + dir)) {
    return;
  }
  fs.readdirSync("./sqls/" + dir).map(async (e) => {
    let moduleFile = "./sqls/" + dir + "/" + e;

    let data = require(moduleFile);

    let result = false;
    let con = false;
    try {
      con = await require("./connection")();
      result = await con.execute(data.sql);
      await con.close();
    } catch (error) {
      console.log(error);
      if (con) {
        await con.close();
      }
    }
    var xls = json2xls(result.rows);
    let newdir = e.split(".")[0].split("-");
    let filename = newdir.pop();

    try {
      dir = ("./data/" + dir + "/" + newdir.join("/")).trim();

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      filename = filename.trim() + ".csv";

      let pathSpace = dir.trim() + "/" + filename;

      fs.writeFileSync(pathSpace, xls, "binary");

      if (data.to.length > 0) {
        mail({
          from: '"Suman Shrestha" <suman.shrestha@ctznbank.com>', // sender address
          to: data.to.join(", "), // list of receivers
          subject: "Report: " + data.title, // Subject line
          html: "<p>Dear sir, </p> PFA", // html body
          attachments: [
            {
              filename: filename,
              path: pathSpace,
            },
          ],
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
}

cron.schedule("*/1 * * * *", async () => caller("minutely"));
caller("minutely");
// caller("hourly");
// cron.schedule('0 * * * *', async() => caller('hourly'))
// cron.schedule('*/15 * * * *', async () => caller('every fifteen minute'))
