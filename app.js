'use strict';

var mustache = require("mustache");
var marked = require("marked");
var fs = require("fs");

//read contents of files, log the output to the console
//TODO: change from console.log to marked() parsing for markdown files
function reader(path){
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
  });
}

//test reader() on hello.md in the example directory
reader('example/hello.md');


//set up the directory structure for __dirname files. Default is from script execution root.
function files(){
    var inputs = {};
    inputs.includes = __dirname + '/_includes';
    inputs.layouts = __dirname + '/_layouts';
    inputs.posts = __dirname + '/_posts';

    return inputs;
}



//turn all markdown from _posts directory into HTML content
function md(){

}

//Build final index.html files using mustache templating
function template(){

}

//use md() and template() to build
function build(){

}
