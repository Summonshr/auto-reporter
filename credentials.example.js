module.exports = {
    user: "<db-username>",
    password: "<db-password>",
    connectString: "<db-ip>:<db-port>/<db-sid>",
    mail:{
        host: "<mail-ip>",
        port: 'mail-port',
        secure: false, // true for 465, false for other ports
        auth: {
          user: '<mail-user-id>', // generated ethereal user
          pass: '<mail-password>', // generated ethereal password
        },
      }
}