'use strict'

const fs = require('fs');
const mustache = require('mustache');
const glob = require('glob');

//populate layout file with HTML from view object (generated with includes())
function layout(layoutsPath, view, data, type){
  view.content = data;
  let layout = fs.readFileSync(layoutsPath + '/' + type + '.html', 'utf8');

  return mustache.render(layout, view);
}

module.exports = {

  //async file reader
  reader(path, callback){
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) throw err;
      callback(data);
    });
  },

  //write marked data to an index.html file at the root of a given path
  writer(layoutsPath, view, path, data, type){
    //build layout here from a 'type' paramenter (e.g. posts or landing page)
    //add data as content to the view object, then use mustache to return final HTML for documents
    const html = layout(layoutsPath, view, data, type);

    //write concatenated data to index.html
    fs.writeFile(path + '/index.html', html, (err) => {
      if (err) console.log(err);
    });
  },

  //set up the helper object of paths for __dirname files. Default is from script execution root.
  //TODO --- set up a better default than error-ing out without a build source
  files(source){
    if (!source) throw new Error('Expected a source path, but none was provided.');

    let paths = {};
    paths.includes = source + '/_includes';
    paths.posts = source + '/_posts';
    paths.site = source + '/_site';
    paths.layouts = source + '/_layouts';
    paths.mixins = source + '/_mixins';

    return paths;
  },

  //build object for mustache view from _includes
  includes(includesPath){
    let includes = {};
    const files = glob.sync(includesPath + '/**/*.html');

    files.forEach(doc => {
      const key = doc.substring(includesPath.length + 1).split('.')[0];
      const data = fs.readFileSync(doc, 'utf8');
      includes[key] = data;
    });
    return includes;
  },

  //parse the filename and output an object of year, month, day, and title
  //filename must have the format YYYY-MM-DD-title-with-hyphens.*
  postParse(filename){
    let info = {};

    info.year = filename.substring(0,4);
    info.month = filename.substring(5,7);
    info.day = filename.substring(8,10);
    info.ext = filename.split('.')[1];
    info.title = filename.substring(11).split('.')[0];

    return info;
  }

}
