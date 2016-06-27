function Cache(grunt) {
    var location = process.cwd() + "/.cache/";
    var fs = require("fs");
    var pathUtil = require("path");

    try {
        fs.mkdirSync(process.cwd() + "/.cache/");
    }
    catch (e){}

    function has(abspath) {
        try {
            var base = pathUtil.basename(abspath);
            var statCache = fs.statSync(location + base);
            var statActual = fs.statSync(abspath);

            return statCache.mtime > statActual.mtime;
        } catch (e){ 
            grunt.log.writeln(e);
            return false;
        }
    }

    function put(abspath, contents) {
        var base = pathUtil.basename(abspath);
        fs.writeFileSync(location + base, contents);
    }

    function get(abspath) {
        var base = pathUtil.basename(abspath);
        return fs.readFileSync(location + base, "utf-8");
    }

    return {
        has: has,
        get: get,
        put: put
    };
}

module.exports = Cache;

