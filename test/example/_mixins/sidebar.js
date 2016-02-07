//start out using require (for app.js)
//but eventually, each mixin should be equivalent to a "script" tag IIFE
//with the Index option passed in... no modules required
// // (or maybe module-style is an option)

const Blog = require('../../../lib/app.js');

const Index = Blog.index(__dirname + '/../../example');

//eventually remove module system (perhaps)
//or just port it in automatically?
module.exports = {
    output(){
      console.log(Index);
    }
}
