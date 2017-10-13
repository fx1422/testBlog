
const common = require('./libs/common.js')
const str = common.md5('123456'+common.MD5_SUFFIX)
console.log(str)