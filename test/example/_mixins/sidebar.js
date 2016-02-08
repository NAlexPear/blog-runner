//start out using require (for app.js)
//but eventually, each mixin should be equivalent to a "script" tag IIFE
//with the Index option passed in... no modules required
// // (or maybe module-style is an option)
'use strict';
const Blog = require('../../../lib/app.js');

const Index = Blog.index(__dirname + '/../../example');

//eventually remove module system (perhaps)
//or just port it in automatically?
module.exports = {
    output(){
      let html = '<div class="sidebar"><ul>';

      Index.forEach(post => {
        const path = post.year + '/' + post.month + '/' + post.day + '/' + post.title;
        html+= '<li><a href="' + path + '">' + post.title + '</a></li>';
      });

      html+= '</ul></div>';
      return html;
    }
}
