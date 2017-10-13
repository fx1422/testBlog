const crypto = require('crypto')

module.exports = {
    MD5_SUFFIX :'WQWMKIAOD%$%^&***(*&^sasa}|:llmld比迪海653233974**/232FDFDG是懒得说了',
    md5: function (str) {
        const obj = crypto.createHash('md5');
        obj.update(str);
        return obj.digest('hex');
    }

};
