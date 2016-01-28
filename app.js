'use strict';

let mustache = require("mustache");
let marked = require("marked");
let fs = require("fs");
let glob = require("glob");

//read contents of files, sends contents to a callback function (probably marked)
function reader(path, callback){
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) throw err;
    callback(data);
  });
}

//quick test output for reader -> marked
//SHOULD OUTPUT HTML TO THE CONSOLE
function testReader(path){
  reader(path, (data) => {
    let output = marked(data);
    console.log(output);
  });
};

//set up the directory structure for __dirname files. Default is from script execution root.
function files(source){
  if (!source) source = __dirname;

  var paths = {};
  paths.includes = source + '/_includes';
  paths.posts = source + '/_posts';
  paths.site = source + '/_site';

  return paths;
}

//sets up directory structure in _site
function structure(source){
  var paths = files(source);

  //build _site directory, unless it already exists
  let sitePath = paths.site;
  fs.mkdir(sitePath, (err) => {
    if (err) {
      if (err.code === 'EEXIST') console.log('the _site folder already exists, building some new children...')
      else console.log(err);
    } else console.log('_site directory initialized')
  });

  //get array of all posts in _posts directory using glob module
  // glob()
}
structure('example');
//turn all markdown from _posts directory into HTML content
function md(data){
}

//Build final index.html files using mustache templating
function template(){

}

//use md() and template() to build index.html files in the _site directory
function build(){

}
