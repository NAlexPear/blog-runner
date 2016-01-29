'use strict';

const marked = require("marked");
const fs = require("fs");
const glob = require("glob");
const Helpers = require('./helpers.js');



//create new directories for the info property passed in, add index.html file to root using fs.readFile and marked()
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

module.exports = {
  //sets up directory structure in _site
  build(source){
    const paths = Helpers.files(source);
    const view = Helpers.includes(paths.includes);

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
        const post = Helpers.postParse(filename);

        //run down the directory structure rabbit hole for each post
        postDir(sitePath, post, 'year');
        postDir(sitePath, post, 'month');
        postDir(sitePath, post, 'day');
        postDir(sitePath, post, 'title');

        //move markdown and template (view) data to index.html file at root of post directories
        Helpers.reader(doc, (data) => {
          const html = marked(data);
          const path = sitePath + '/' + post.year + '/' + post.month + '/' + post.day + '/' + post.title;
          Helpers.writer(paths.layouts, view, path, html, 'posts');
        });
      });
    });

    //build landing page (index.html) using same writer function as for posts, without needing to read markdown
    Helpers.writer(paths.layouts, view, sitePath, '', 'landing');
  }
}
