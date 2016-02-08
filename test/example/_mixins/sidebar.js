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
      let years = [];
      let months = [];

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

        if (years.indexOf(post.year) === -1) years.push(post.year);
        if (months.indexOf(month) === -1) months.push(month);
        const path = post.year + '/' + post.month + '/' + post.day + '/' + post.title;
        html+= '<li><a href="' + path + '">' + post.title + '</a></li>';
      });


      console.log(years);
      console.log(months);

      html+= '</ul></div>';
      return html;
    }
}
