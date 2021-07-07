const OracleDB = require("oracledb");

OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

module.exports = async function (request) {
    return await OracleDB.getConnection(require('./credentials'));
}