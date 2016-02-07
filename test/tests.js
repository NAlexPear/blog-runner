'use strict';

const rmrf = require('rimraf');
const fs = require('fs');
const glob = require('glob');
const chai = require('chai');
const assert = require('chai').assert;
const Blog = require('../lib/app.js');
const Helpers = require('../lib/helpers.js');

//additions to String object for use with title formatting
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

//MAIN app.js functions
describe('Blog.index()', () => {
  const output = Blog.index(__dirname + '/example');
  it('returns an index array', () => {
    assert.isArray(output);
  });

  it('...with length equal to the number of posts', () => {
    const posts = glob.sync( __dirname + '/example/_posts/*.md');
    assert.equal(output.length, posts.length);
  });
});

describe('Blog.mixin()', () => {
  const path = __dirname + '/example';
  function testMix(){ Blog.mixin(path); }
  it('executes files from the _mixins directory', () => {
    assert.doesNotThrow(testMix, Error);
  });
});

describe('Blog.roll()', () => {
  function rollInit(config){
    //start test by removing blogroll.html include
    try{
      fs.unlinkSync(__dirname + '/example/_includes/blogroll.html');
    } catch(err) {
      console.log(err);
    }
    //then rebuild
    if (config) Blog.roll(__dirname + '/example', config);
    else Blog.roll(__dirname + '/example');
  }

  it('creates a new blogroll.html _includes file', () => {
    rollInit();
    const includesPath = __dirname + '/example/_includes';
    const includes = glob.sync(includesPath + '/**/*.html');
    let filenames = [];
    includes.forEach(include => {
      const filename = include.substring(includesPath.length + 1);
      filenames.push(filename);
    });
    assert.include(filenames,'blogroll.html');
  });

  describe('responds correctly to custom configurations, including:', () => {
    function rollData(){
      const path = __dirname + '/example/_includes/blogroll.html';
      const html = fs.readFileSync(path, 'utf8');
      return html;
    }
    //title test
    it('formatted titles', () => {
      const config = {
        title: false
      }
      rollInit(config);
      const index = Blog.index(__dirname + '/example');
      const titleTest = rollData();
      index.forEach(post => {
        const titleFormatted = post.title.replaceAll('-', ' ').capitalize();
        assert.notInclude(titleFormatted, titleTest);
      });
    });

    //date test
    it('dates in MM/DD/YYYY format', () => {
      const config = {
        date: false,
        dateFormat: 'MM/DD/YYYY'
      }
      rollInit(config);
      const index = Blog.index(__dirname + '/example');
      const dateTest = rollData();

      index.forEach(post => {
        const dateFormatted = post.month + '/' + post.day + '/' + post.year;
        assert.notInclude(dateFormatted, dateTest);
      });
    });

    //snippets test (from final post docs)
    describe('handles snippets correctly', () => {
      //HELPER FUNCTIONS
      //gets nth position of search term m from string str
      function getPosition(str, m, n){
        return str.split(m, n).join(m).length;
      }
      //snips and sanitizes html data
      function snipHtml(config, html){
        const p = getPosition(html, '<p>', 2);
        const htmlStripped = html.substring(p, config.snippetChars + p).replace(/<(?:.|\n)*?>/gm, '');
        const snippet = '<p>' + htmlStripped + '</p>';
        return snippet;
      };

      //compares test snippet with data from the generated blogroll.html _include file
      function compareHtml(config, test){
        rollInit(config);
        const index = Blog.index(__dirname + '/example');
        const snipTest = rollData();
        index.forEach(post => {
          const path = __dirname + '/example/_site/' + post.year + '/' + post.month + '/' + post.day + '/' + post.title + '/index.html';
          const data = fs.readFileSync(path, 'utf8');
          const snippetTest = snipHtml(config, data);
          test(snipTest, snippetTest);
        });
      };

      //SNIPPET TESTS
      it('snippets are excluded correctly', () => {
        const config = {
          snippet: false
        };
        function test(blogrollData, testData) {
          assert.notInclude(blogrollData, testData);
        };
        compareHtml(config, test);
      });

      it('sanitizes snippet HTML', () => {
        const config = {
          snippet: true,
          snippetChars: 200
        };
        function test(blogrollData, testData) {
          assert.include(blogrollData, testData);
        };
        compareHtml(config, test);
      });
    });
  });
});

describe('Blog.build()', () => {
  //start test by removing _site directory
  try{
    rmrf.sync(__dirname + '/example/_site');
  } catch(err) {
    console.log(err);
  }

  //then rebuild
  Blog.build(__dirname + '/example');

  it('creates a _site directory if one does not already exist', () => {
    const dirs = fs.readdirSync(__dirname + '/example');
    assert.include(dirs, '_site');
  });

  it('...that includes a single valid index.html file at its root', () => {
    const index = glob.sync(__dirname + '/example/_site/index.html');
    assert.equal(index.length, 1);
  });

  it('...and that includes a separate directory for each year', () => {
    const dirs = fs.readdirSync(__dirname + '/example/_site');
    const index = Blog.index(__dirname + '/example')
    let years = [];
    index.forEach(post => {
      if(years.indexOf(post.year) === -1) {
        years.push(post.year);
      }
    });
    years.forEach(year => {
      assert.include(dirs, year);
    });
  });

  it('creates a separate index.html file for each post', () => {
    const files = glob.sync(__dirname + '/example/_site/**/index.html');
    const posts = glob.sync(__dirname + '/example/_posts/**/*.md');

    assert.equal(files.length, posts.length + 1);
  });
});

//HELPERS (from helpers.js)
describe('Helpers.reader()', () => {
  it('should return a String for valid data', () => {
    Helpers.reader(__dirname + '/tests.js', (err, data) =>{
      assert.isString(data);
    });
  });
  it('should throw an error for an invalid path', () =>{
    Helpers.reader('./fake/path/to/nowhere', (err, data) => {
      assert.instanceOf(err, Error);
    });
  });
});

describe('Helpers.writer()', function() {
  it('should overwrite index.html files at the root of each _site directory branch', () => {
    //check index.html files for changes here
  });
});

describe('Helpers.files()', () => {
  const output = Helpers.files(__dirname + '/example')
  it('should return an Object', () => {
    assert.isObject(output);
  });
  it('...with the correct keys', () => {
    const targets = ['includes', 'posts', 'site', 'layouts'];
    const keys = Object.keys(output);
    assert.sameMembers(targets, keys);
  });
});

describe('Helpers.includes()', () => {
  const path = (__dirname + '/example/_includes');
  const output = Helpers.includes(path);

  it('should return an Object if given a valid path', () => {
    assert.isObject(output);
  });

  it('should assign key names identical to filenames in _includes directory', () => {
    const files = glob.sync(path + '/**/*.html');
    const outputNames = Object.keys(output);

    let i = 0;
    outputNames.forEach(name => {
      assert.include(files[i], name);
      i++;
    });
  });

  it('should set HTML content as the property of each _includes key', () => {
    for(let key in output) {
      assert.include(output[key], '</');
    }
  });
});
