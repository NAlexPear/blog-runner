'use strict';

var mustache = require("mustache");
var marked = require("markdown");
var Transform = require("stream").Transform;

//set up parser to read data from markdown files
var parser = new Transform();
parser._transform = function (data, done) {
    this.push(data);
    done();
};

//pipe the stream through the parser
process.stdin
    .pipe(parser)
    .pipe(process.stdout);

process.stdout.on('error', process.exit);

//set up the directory structure for source files. Default is from script execution root.
function files(source = __dirname){
    var inputs = {};
    inputs.includes = source + '/_includes';
    inputs.layouts = source + '/_layouts';
    inputs.posts = source + '/_posts';
    
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
    
};