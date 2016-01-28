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
      if (err.code === 'EEXIST') console.log('the _site folder already exists, building some new children...');
      else console.log(err);
    } else console.log('_site directory initialized')
  });

  //get array of all posts in _posts directory using glob module
  //then create a new set of directories according to the post title
  let postsPath = paths.posts;
  glob(postsPath + '/**/*.md', (err, files) => {
    if (err) console.log(err);
    else files.forEach(doc => {
      let filename = doc.substring(postsPath.length + 1);
      let post = postParse(filename);

      //run down the directory structure rabbit hole for each post
      postDir(sitePath, post, 'year');
      postDir(sitePath, post, 'month');
      postDir(sitePath, post, 'day');
      postDir(sitePath, post, 'title');

      console.log(post);
    });
  });
}
structure('example');

//parse the filename and output an object of year, month, day, and title
//filename must have the format YYYY-MM-DD-title-with-hyphens.*
function postParse(filename){
  let info = {};

  info.year = filename.substring(0,4);
  info.month = filename.substring(5,7);
  info.day = filename.substring(8,10);
  info.ext = filename.split('.')[1];
  info.title = filename.substring(11).split('.')[0];

  return info;
}

//create new directories for the info property passed in
function postDir(sitePath, info, key){
  let path = sitePath + '/';
  if (key === 'year') path += info.year;
  else if (key === 'month') path += info.year + '/' + info.month;
  else if (key === 'day') path += info.year + '/' + info.month + '/' + info.day;
  else if (key === 'title') path += info.year + '/' + info.month + '/' + info.day + '/' + info.title;

  fs.mkdir(path, (err) => {
    if (err) {
      if (err.code === 'EEXIST') {
        console.log('the ' + path + ' folder already exists, building some new children...');
      }
      else console.log(err);
    } else {
      console.log(path + ' directory added!');
    }
  });

}

//turn all markdown from _posts directory into HTML content
function md(data){
}

//Build final index.html files using mustache templating
function template(){

}

//use md() and template() to build index.html files in the _site directory
function build(){

}
