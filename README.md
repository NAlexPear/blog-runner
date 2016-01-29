# Blog Runner

## A lightweight static site generator for bloggers built for the JavaScript environment.

### Built and maintained by [Alex Pearson](https://alexpear.com)


Blog Runner is a simple static site generator that includes basic templating and Markdown support, built as a bare-bones replacement for [Jekyll](http://jekyllrb.com). Blog Runner is built on top of the [`mustache.js`](https://github.com/janl/mustache.js/) templating library and the [`marked`](https://github.com/chjj/marked) Markdown parser. The latest build can be seen in action on the author's blog: [alexpear.com](https://alexpear.com).


## Installation

Blog Runner is packaged as an `npm` module. The package should be installed as a `devDependency` in your project's `package.json` file.

### devDependency:

```shell
npm install --save-dev blog-runner
```

## Usage

### Directory Structure

`blog-runner` requires a specific directory structure to run correctly. You may execute `build` on any folder, as long as it is organized using a modified versino of the [Jekyll directory structure](http://jekyllrb.com/docs/structure/). The only modifications to this structure should be:

1. No `_config.yml` file (configuration is intentionally limited in early versions)
2. No `index.html` file (one will be generated from the `landing.html` layout)
3. No `_site` directory (one will be generated for you)
4. No `_data` directory (YAML data is unsupported at this time)
5. In `_layouts`, `default.html` should be called `landing.html`

All files in `_layouts` and `_includes` should be `*.html` files, and all files in `_drafts` and `_posts` should be `*.md` (Markdown) files. No YAML font-matter is required, as all supported data is currently parsed from each post's filename.

### Execution

It's best to use `blog-runner` as a part of a build process. The module exports a `build` function for your use.

```javascript
const blog = require('blog-runner');

blog.build();
```
By default, `build` runs from the location of the build file. To use a difference source directory, you can pass a directory path as a parameter to the `build` function.

```javascript
const blog = require('blog-runner');

blog.build('path/to/blog/directory');
```
