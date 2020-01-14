var fs = require('fs-extra');
var config;
try{
    config = require("./build.config.json");
} catch (err){}


var files = ['vff-ext.js','vff-ext.js.map'];
var source = './dist/';

function copyCB(src,dest){
    return function(){
        // console.log('Copied ' + src + ' to ' + dest);
    }
}

if(config && config.destinations){
    for(var i = 0 ; i < config.destinations.length ; i++) {
        var dest = config.destinations[i].endsWith("/")? config.destinations[i] : (config.destinations[i] + "/");
        for(var j = 0 ; j < files.length ; j++){
            fs.copy(source + files[j], dest + files[j], copyCB(source + files[j], dest + files[j]));
        }
    }
    console.log('Copied vff to dev destinations (async)');
}