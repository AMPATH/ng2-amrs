var fs = require("fs");
var package = require('./package');
const execSync = require('child_process').execSync;
function main() {
    fs.readdir("./node_modules", function (err, dirs) {

        if (err) {
            console.log(err);
            return;
        }
        var dependencies = {};
        index = 0;
        for (let dir of dirs) {
            if (dir.indexOf(".") !== 0) {
                var packageJsonFile = "./node_modules/" + dir + "/package.json";
                if (fs.existsSync(packageJsonFile)) {
                    var data = fs.readFileSync(packageJsonFile);
                    var json = JSON.parse(data);
                    //console.log('"' + json.name + '": "' + json.version + '",');
                    dependencies[json.name] = json.version;
                }
            }
            index++
        }
        var newPackage = Object.assign({}, package);
        newPackage.dependencies = dependencies;
        fs.writeFileSync('package-snapshot.json', JSON.stringify(newPackage, null, 4));
        execSync(`git add -A`);
    });

}

main()