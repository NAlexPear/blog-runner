[![npm version](https://badge.fury.io/js/blog-runner.svg)](https://badge.fury.io/js/blog-runner)
[![npm](https://img.shields.io/npm/l/express.svg)](https://www.npmjs.com/package/blog-runner)

![blog-runner logo](http://i.imgur.com/gKZaxcQ.png)

## A lightweight static site generator for bloggers built for the JavaScript environment.


Blog Runner is a simple static site generator that includes basic templating and Markdown support, built as a bare-bones replacement for [Jekyll](http://jekyllrb.com). Blog Runner is built on top of the [`mustache.js`](https://github.com/janl/mustache.js/) templating library and the [`marked`](https://github.com/chjj/marked) Markdown parser. The latest build can be seen in action on the author's blog: [alexpear.com](https://alexpear.com).


## Installation

Blog Runner is packaged as an `npm` module. The package should be installed as a `devDependency` in your project's `package.json` file.

### devDependency:

```shell
npm install --save-dev blog-runner
```

## Usage

### Directory Structure

`blog-runner` requires a specific directory structure to run correctly. You may execute `build` on any folder, as long as it is organized using a modified version of the [Jekyll directory structure](http://jekyllrb.com/docs/structure/). The only modifications to this structure should be:

1. No `_config.yml` file (configuration is intentionally limited in early versions)
2. No `index.html` file (one will be generated from the `landing.html` layout)
3. No `_site` directory (one will be generated for you)
4. No `_data` directory (YAML data is unsupported at this time)
5. In `_layouts`, `default.html` should be called `landing.html`

All files in `_layouts` and `_includes` should be `*.html` files, and all files in `_drafts` and `_posts` should be `*.md` (Markdown) files. No YAML font-matter is required, as all supported data is currently parsed from each post's filename.

All posts should be named according to the following structure:

```
YYYY-MM-DD-title-with-hyphens.md
```
For example:
```
2016-01-01-happy-new-year-everybody.md
```
When your `_site` directory is built, the example post will have a file path of:
```
/2016/01/01/happy-new-year-everybody/index.html
```
---

> Since there is no YAML front matter or config file, it is EXTREMELY IMPORTANT that you organize your blog directory and name your files according to these conventions! Otherwise, your site won't build correctly.



### Execution

`blog-runner` is meant to be used as a part of a build process. The blog structure is built into a `_site` directory, which you will copy over to your live web server. The module currently exports three functions for your use: `index`, `roll`, and `build`.

#### `require`
You can access the main methods through `require`:
```javascript
const blog = require('blog-runner');
```

#### `index(source)`
The `index()` method returns an array of objects containing all post data, including title, and the year, month, and day of publishing. All post objects are arranged in the array in chronological order by publishing date. This function is only a helper function, and does not make any changes to `_site`.

You are required to pass in a `source` parameter that points to the directory that you would like indexed.

```javascript
blog.index('path/to/source/directory');
```

#### `roll(source, [{config options}])`
For those looking to include a standard index view of posts on one of their pages (probably a landing page), `roll()` will build a new `blogroll.html` include in the `_includes` directory for your use.

`roll()` requires a source directory, and takes an optional configuration object as an argument.

By default, `roll()` will include formatted post titles, dates (in MM/DD/YYYY format), and a 200 character snippet for each post. Configuration options:

```javascript
{
  //includes a formatted title for each post.
  //set to false to exclude titles.
  title:true,

  //includes a formatted date for each post.
  //set to false to exclude dates.
  date: true,

  //sets date format. Currently accepts any combination of MM/DD/YYYY.
  //More eloquent date parsing is a WIP.
  dateFormat: 'MM/DD/YYYY',

  //provides a snippet of length equal to snippetChars.
  //set to false to exclude snippets.
  snippet: true,

  //default snippet length is 200 characters.
  //set snippetChars to any integer value to modify snippet length.
  snippetChars: 200
}
```

>Future configuration options will include more `dateFormat` options, a `postNum` option for limiting the number of posts displayed, and a `paginate` option to allow for multiple pages of posts equal to `postNum`.

To use `roll()`'s output, be sure to include `{{{ blogroll }}}` somewhere in your page's layout (usually `landing.html` for most blogs), and include `roll()` in your build process. Some example usages:

```javascript
//with defaults options only
blog.roll('path/to/source/directory');

//without dates or snippets
blog.roll('path/to/source/directory', {
  date: false,
  snippet: false
});

//with 1000-character snippets
blog.roll('path/to/source/directory', {
  snippetChars: 1000
});
```

#### `build(source)`
The bread-and-butter method of blog-runner, `build()` generates the `_site` directory. No other function modifies the `_site` directory, so make sure that if you're including custom mixins or generators (like `roll()`) that you execute those before executing `build()`.

A source is required for `build()` to work:
```javascript
blog.build('path/to/blog/directory');
```

### Future Features

The next major feature will be allowing the use of custom mixins (like blogrolls), that use custom `*.js` files in a `_mixins` directory to build new `*.html` files in the `_includes` directory. This feature should be ready by version `0.2.0`.

Built and maintained by [Alex Pearson](https://alexpear.com)
