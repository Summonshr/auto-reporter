var cron = require('node-cron');
var fs = require('fs')
var json2xls = require('json2xls');

function caller(dir){
  console.log('calling ' + dir + ' jobs')
  fs.readdirSync('./sqls/' + dir).map(e=>{
    fs.readFile('./sqls/' + dir + '/' + e, 'utf8', async function(err, data) {
        if (err) throw err;
        let result = false;
        let con = false;
        try {
          con = await require('./connection')();
          result = await con.execute(data);
          await con.close();
        } catch (error) {
          console.log(error)
          if(con) {
            await con.close();
          }
        }
      
        var xls = json2xls(result.rows);
        let dir = e.split('.')[0].split('-')
        let filename = dir.pop()

        try {
          dir = ('./data/'+dir.join('/')).trim()

          if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
          }

          filename = dir.trim() + '/' + filename.trim() + ".csv"
    
          fs.writeFileSync(filename, xls, 'binary');
        } catch (error) {
          console.log(error)
        }
    });
  })
}
cron.schedule('*/1 * * * *', async() => caller('minutely'))
cron.schedule('0 * * * *', async() => caller('hourly'))
cron.schedule('*/15 * * * *', async () => caller('every fifteen minute'))