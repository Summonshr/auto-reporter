const nodemailer = require("nodemailer");

async function mail(obj) {

  let transporter = nodemailer.createTransport(require('./credentials').mail);

  let info = await transporter.sendMail(obj);

    console.log(info)
}


module.exports = mail