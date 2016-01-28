'use strict';

const mustache = require("mustache");
const marked = require("marked");
const fs = require("fs");
const glob = require("glob");

//read contents of files, sends contents to a callback function (probably marked)
function reader(path, callback){
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) throw err;
    callback(data);
  });
}

//set up the directory structure for __dirname files. Default is from script execution root.
function files(source){
  if (!source) source = __dirname;

  let paths = {};
  paths.includes = source + '/_includes';
  paths.posts = source + '/_posts';
  paths.site = source + '/_site';
  paths.layouts = source + '/_layouts';

  return paths;
}

//sets up directory structure in _site
function build(source){
  const paths = files(source);

  //build _site directory, unless it already exists
  const sitePath = paths.site;
  fs.mkdir(sitePath, (err) => {
    if (err) {
      if (err.code === 'EEXIST') console.log('the _site folder already exists, building some new children...');
      else console.log(err);
    } else console.log('_site directory initialized')
  });

  //get array of all posts in _posts directory using glob module
  //then create a new set of directories according to the post title
  const postsPath = paths.posts;
  glob(postsPath + '/**/*.md', (err, files) => {
    if (err) console.log(err);
    else files.forEach(doc => {
      const filename = doc.substring(postsPath.length + 1);
      const post = postParse(filename);

      //run down the directory structure rabbit hole for each post
      postDir(sitePath, post, 'year');
      postDir(sitePath, post, 'month');
      postDir(sitePath, post, 'day');
      postDir(sitePath, post, 'title');

      //move markdown data to index.html file at root
      reader(doc, (data) => {
        const html = marked(data);
        const path = sitePath + '/' + post.year + '/' + post.month + '/' + post.day + '/' + post.title;
        writer(path, html);
      });
    });
  });

  //build object of template includes from includes() function
  includes(paths.includes);
}
//quick test on the example directory
build('example');

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

//create new directories for the info property passed in, add index.html file to root using reader() and marked()
function postDir(sitePath, info, key){
  let path = sitePath + '/';
  if (key === 'year') path += info.year;
  else if (key === 'month') path += info.year + '/' + info.month;
  else if (key === 'day') path += info.year + '/' + info.month + '/' + info.day;
  else if (key === 'title') path += info.year + '/' + info.month + '/' + info.day + '/' + info.title;

  fs.mkdir(path, (err) => {
    if (err) {
      if (err.code === 'EEXIST') {
        // console.log('the ' + path + ' folder already exists, building some new children...');
      }
      else console.log(err);
    } else {
      console.log(path + ' directory added!');
    }
  });

}

//write marked data to an index.html file at the root of a given path
function writer(path, data){
  fs.writeFile(path + '/index.html', data, (err) => {
    if (err) console.log(err);
  });
}

//build object for mustache view from _includes
function includes(includesPath){
  var includes = {};

  function objectMapper(data, key) {
    includes[key] = data;
    console.log(includes);
  }

  glob(includesPath + '/**/*.html', (err, files) => {
    if (err) console.log(err);
    else files.forEach(doc => {
      const key = doc.substring(includesPath.length + 1).split('.')[0];
      reader(doc, (data) => {
        objectMapper(data, key);
      });
    });
  });
  return includes;
}

//
