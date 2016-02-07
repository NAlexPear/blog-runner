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
  //export an index object for use with blog rolls and archive views in node or browserify
  //Lists all posts in sequential order, including titles and dates published
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
  //allow for custom mixing through JavaScript files saved to the _mixins
  mixin(source){
    const jsFilesArray = glob.sync(source + '/_mixins/*.js');
    jsFilesArray.forEach(file => {
      const data = fs.readFileSync(file, 'utf8');
      //TODO-- remove eval in favor of enforced module pattern
      eval(data);
    });
  },
  //create a special blogroll _include from indexed data
  roll(source, config){
    String.prototype.replaceAll = function(search, replace){
        if (replace === undefined) {
            return this.toString();
        }

        return this.replace(new RegExp('[' + search + ']', 'g'), replace);
    };

    String.prototype.capitalize = function(){
      return this.replace(/(?:^|\s)\S/g, (a) => {
        return a.toUpperCase();
      });
    };

    const paths = Helpers.files(source);
    const includesPath = paths.includes;

    const defaults = {
      title: true,
      date: true,
      dateFormat: 'MM/DD/YYYY',
      snippet: true,
      snippetChars: 200,
      postNum: 1000,
      paginate: false
    };

    var config = config || {};
    for (let key in defaults){
      if (config[key] === undefined) config[key] = defaults[key];
    }

    const index = module.exports.index(source);
    let output = '';

    //add each post's title, date, and snippet if required by the configuration object
    index.forEach(post => {
      let title = '';
      let date = '';
      let snippet = '';
      const path = post.year + '-' + post.month + '-' + post.day + '-' + post.title + '.' + post.ext;
      const postPath = paths.posts + '/' + path;
      const finalPostPath = post.year + '/' + post.month + '/' + post.day + '/' + post.title + '/index.html';
      const titleFormatted = post.title.replaceAll('-', ' ').capitalize();

      if (config.title) title = '<h3><a href="'+ finalPostPath + '">' + titleFormatted + '</a></h3>';
      if (config.date) date = '<div class="date">' + post.month + '/' + post.day + '/' + post.year + '</div>';
      if (config.snippet) {
        function snip(data){
          const html = marked(data);
          const p = html.indexOf('<p>');
          const htmlStripped = html.substring(p, config.snippetChars + p).replace(/<(?:.|\n)*?>/gm, '');
          snippet = '<p>' + htmlStripped + '</p>';
        };
        const data = fs.readFileSync(postPath, 'utf8');
        snip(data);
      };
      output = title + date + snippet + '<br>' + output;
    });

    fs.writeFileSync(includesPath + '/blogroll.html', output);
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
