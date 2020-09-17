const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');

let configurationObject = {};
let loadedfilepath = "UNSET";

// Return YAML from file
// CALLBACK either a plain object, a string or undefined
function getObjectFromYaml(yamlpath, callback) {
    try {
        const doc = yaml.safeLoad(fs.readFileSync(yamlpath, 'utf8'));
        callback(null, doc);
    } catch (e) {
        callback(e);
    }
}

// Update YAML file from object
// CALLBACK either success (TRUE) or errors
function setYamlFromObject(yamlpath, object, callback) {
    try {
        fs.writeFileSync(yamlpath, yaml.safeDump(object));
        callback();
    } catch (e) {
        callback(e);
    }
}

// Set what config file to modify
function setConfigFile(filename) {
    loadedfilepath = path.join(__dirname, "config", filename)
    getObjectFromYaml(loadedfilepath, (err, data) => {
        if (err) throw err;
        configurationObject = data;
    })
}

// Commit modified configuration to file
function commitConfigFile(filename=loadedfilepath) {
    if (filename === "UNSET") return false;
    if (filename !== loadedfilepath) {
        setYamlFromObject(path.join(__dirname, "config", filename), configurationObject, (err) => {
            if (err) throw err;
        })
    } else {
        setYamlFromObject(loadedfilepath, configurationObject, (err) => {
            if (err) throw err;
        })
    }
}

// Set webport
function setWebPort(port) {
    configurationObject.app.port = port;
}

module.exports = {
    setConfigFile,
    commitConfigFile,
    setWebPort
}