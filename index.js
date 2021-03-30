var cron = require('node-cron');
var fs = require('fs')
var json2xls = require('json2xls');

function caller(dir){
  fs.readdirSync('./sqls/' + dir).map(e=>{
    fs.readFile('./sqls/' + dir + '/' + e, 'utf8', async function(err, data) {
        if (err) throw err;
        const con = await require('./connection')()
        const result = await con.execute(data);
        await con.close();
  
        var xls = json2xls(result.rows);
        let dir = e.split('.')[0].split('-')
        let filename = dir.pop()

        dir = './data/'+dir.join('/')

        if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
        }
  
        fs.writeFileSync(dir + '/' + filename + ".xls", xls, 'binary');
    });
  })
}


cron.schedule('0 * * * *', async() => caller('hourly'))