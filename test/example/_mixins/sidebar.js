//start out using require (for app.js)
//but eventually, each mixin should be equivalent to a "script" tag IIFE
//with the Index option passed in... no modules required
// // (or maybe module-style is an option)
'use strict';
const Blog = require('../../../lib/app.js');
const path = require('path');
const source = path.join(__dirname, '..');
const Index = Blog.index(source);

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

//eventually remove module system (perhaps)
//or just port it in automatically?
module.exports = {
    output(){
      let html = '<div class="sidebar"><ul>';
      let years = [];
      let printed = {};

      Index.forEach(post => {
        
        let month = '';
        switch (post.month) {
          case '01':
            month = 'January';
            break;
          case '02':
            month = 'February';
            break;
          case '03':
            month = "March";
            break;
          case '04':
            month = "April";
            break;
          case '05':
            month = "May";
            break;
          case '06':
            month = 'June';
            break;
          case '07':
            month = 'July';
            break;
          case '08':
            month = 'August';
            break;
          case '09':
            month = 'September';
            break;
          case '10':
            month = 'October';
            break;
          case '11':
            month = 'November';
            break;
          case '12':
            month = 'December';
            break;
        }
        
        if (years.indexOf(post.year) === -1) {
          html += `<li class="year" style="list-style-type:none;"><h4> ${post.year} </h4></li>`;
          years.push(post.year);
          printed[post.year] = [];
          html += `<li class="year" style="list-style-type:none;"><b> ${month} </b></li>`;
          printed[post.year].push(month);
        } else {
          if (printed[post.year].indexOf(month) === -1) {
            html += `<li class="year" style="list-style-type:none;"><b> ${month} </b></li>`;
            printed[post.year].push(month);
          }
        }
        
        const path = post.year + '/' + post.month + '/' + post.day + '/' + post.title;
        const titleFormatted = post.title.replaceAll('-', ' ').capitalize();
        html += '<li><a href="' + path + '">' + titleFormatted + '</a></li>';
      
      });
      
      

      // Index.forEach(post => {});

      html+= '</ul></div>';
      return html;
    }
}
