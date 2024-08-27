/* izy-loadobject nodejs-require */
const scoParserGenerator = require('./index.js');
const { execSync } = require('child_process');
module.exports = (function() {
    const scormModule = () => {};
    scormModule.verify = queryObject => {
        const { path } = queryObject;
        const pathToExtractZip = '/tmp/scormtool';
        execSync(`rm -rf ${pathToExtractZip}`);
        var params = {
            pathToScoZip: path,
            pathToExtractZip
        };
        var scoParser = scoParserGenerator(params);
        scoParser.validate(function(err, result) {
            if (err) {
                console.log({ err, result });
                return ;
            }
            scoParser.parse(function(err, scoInfo) {
                console.log(scoInfo);
                scoParser.destroy(function(err) {});
            });
        });
    }
    return scormModule;
})();
