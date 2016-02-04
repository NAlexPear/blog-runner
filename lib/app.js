'use strict';

const marked = require("marked");
const fs = require("fs");
const glob = require("glob");
const Helpers = require('./helpers.js');


//keep fs.mkdirSync from throwing an error if a file already exists
function mkdirSync(path){
  try {
    fs.mkdirSync(path);
  } catch(err) {
    if (err.code != 'EEXIST') throw err;
  }
}

//create new directories for the info property passed in, add index.html file to root using fs.readFile and marked()
function postDir(sitePath, info, key){
  let path = sitePath + '/';
  if (key === 'year') path += info.year;
  else if (key === 'month') path += info.year + '/' + info.month;
  else if (key === 'day') path += info.year + '/' + info.month + '/' + info.day;
  else if (key === 'title') path += info.year + '/' + info.month + '/' + info.day + '/' + info.title;

  mkdirSync(path);
}

module.exports = {
  //export an index object for use with blog rolls and archive views
  //should list all posts in sequential order, including titles, dates published, and preview snippets of post bodies
   index(source){
     const paths = Helpers.files(source);
     const postsPath = paths.posts;
     let index = [];

     let posts = glob.sync(postsPath + '/**/*.md');
     posts.forEach(doc => {
       const filename = doc.substring(postsPath.length + 1);
       const post = Helpers.postParse(filename);

       index.push(post);
     });

     return index;
   },

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
    const index = module.exports.index(source);

    //run down the directory structure rabbit hole for each post
    index.forEach(post => {
      postDir(sitePath, post, 'year');
      postDir(sitePath, post, 'month');
      postDir(sitePath, post, 'day');
      postDir(sitePath, post, 'title');

      //move markdown and template (view) data to index.html file at root of post directories
      const path = post.year + '-' + post.month + '-' + post.day + '-' + post.title + '.' + post.ext;
      const postPath = paths.posts + '/' + path;

      Helpers.reader(postPath, (data) => {
        const html = marked(data);
        const newPath = sitePath + '/' + post.year + '/' + post.month + '/' + post.day + '/' + post.title;
        Helpers.writer(paths.layouts, view, newPath, html, 'posts');
      });
    });

    //build landing page (index.html) using same writer function as for posts, without needing to read markdown
    Helpers.writer(paths.layouts, view, sitePath, '', 'landing');
  }
}
