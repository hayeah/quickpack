# The Quickest Way To Start Using Webpack

Webpack is an incredibly capable tool, but the jungle of configuration options can be overwhelming for new comers.

Quickpack is [omakase](http://david.heinemeierhansson.com/2012/rails-is-omakase.html). As long as your project follows a set of best practices, quickpack just works.

```
npm install quickpack -g
```

Suppose your project entry file is `index.js`:

```js
// ES6 support with Babel.
import React from "react";
import {renderDOM} from "react-dom";

// PostCSS support with autoprefixer.
import "normalize.css";

// CSS Module
import style from "./App.css"

// JSX support
class App extends React.Component {
  render() {
    return <div className={style.hello}>hello quickpack</div>;
  }
}

renderDOM(<App/>,document.querySelector("#react-root"));
```

Quickpack can build this project without any configuration:

```
# Default output to build/index.js
quickpack build index.js
```

And to watch the project, add the `--watch` flag:

```
quickpack build index.js --watch
```

To build multiple entry files simultaneously:

```
quickpack build entry1.js entry2.js
```

And you can change the output file names:

```
quickpack build page1=entry1.js page2=entry2.js
```

# Fit For Production

When building a C program for release, you don't think about what compiler optimizations to enable. You tell the compiler "please optimize the heck out of my program". Similiarly with `quickpack`, you simply turn on the `production` option:

```
quickpack build index.js --production
```

Production mode enables these optimizations:

+ Minifying with uglify.
+ Static resource loading.
+ Extract CSS into separate files.
+ Long-term caching with unique md5 hash.
+ Chunk splitting (coming...).

It would also disable development features like source map.

# A Productive Development Environment

Webpack already has sophisticated development tools. The only problem is getting all the tools to work! Quickpack gives you a productive development environment with one command:

```
# visit: localhost:8080/
quickpack server index.js
```

No flags. No config. The server comes with these features:

+ Static server.
+ Fast source map.
+ Live-edit.
+ React Hot-Reload.
+ React error page.

# Evolving Best Practices

Even experienced Webpack users rely on various boilerplates to kickstart new projects. But as new best practices and new tools emerge, it's hard to upgrade old projects that grew out of boilerplates.

Boilerplate projects are trapped in the best practices and tools of yesterday.

Quickpack will makes sure that as long as you use the same major version, your project will keep working, even as new features are added.

As new incompatible best practices emerge, a new major version will be released, perhaps with a [migration tool](https://blog.golang.org/introducing-gofix) to ease your upgrade.

By removing all configuration from projects, we can evolve the way we work by upgrading a single tool.

# Help

```
$ quickpack build -h
quickpack build page1=./entry1 page2=./entry2 ...

Options:
  -w, --watch        Watch mode                                                      [boolean] [default: false]
  -t, --target       Target platform                                                  [string] [default: "web"]
  -p, --production   Build for production environment                                [boolean] [default: false]
  -o, --output       Output directory                                               [string] [default: "build"]
  --hash             Enable long-term cache hashing                                  [boolean] [default: false]
  --source-map       source map (dev only)                                            [boolean] [default: true]
  --source-map-type  source map type                         [string] [default: "cheap-module-eval-source-map"]
  --library          Build as CommonJS module                                        [boolean] [default: false]
  --uglify           source map (production only)                                     [boolean] [default: true]
  -h, --help         Show help                                                                        [boolean]

Examples:
  quickpack build entry.js                              Build entry.js
  quickpack build entry1.js entry1.js                   Build multiple entries
  quickpack build page2=./entry1.js page2=./entry2.js   Multiple entries with output names
  quickpack build index.js --target=node                Build for NodeJS
  quickpack build index.js --library                    Outout CommonJS module
```

```
$ quickpack server -h
quickpack server page1=./entry1 page2=./entry2 ...

Options:
  --port             port number (default: 8000)
  -p, --production   Build for production environment                                [boolean] [default: false]
  -o, --output       Output directory                                               [string] [default: "build"]
  --hash             Enable long-term cache hashing                                  [boolean] [default: false]
  --source-map       source map (dev only)                                            [boolean] [default: true]
  --source-map-type  source map type                         [string] [default: "cheap-module-eval-source-map"]
  --library          Build as CommonJS module                                        [boolean] [default: false]
  --uglify           source map (production only)                                     [boolean] [default: true]
  -h, --help         Show help                                                                        [boolean]

Examples:
  PORT=4321 quickpack server  use ENV to specify port
```

# Contribute

Try quickpack for prototypes and personal projects.

As of now, the set of "best practices" is not yet well defined. Before version 1, this tool is a summary of my personal preferences and quirks. Together we'll determine what the best practices are, and move this tool to version 1.

Improve the build tool, and everybody benefits.

### Experimental: NodeJS

+ It might not be a bad idea to build NodeJS projects with Webpack.
+ Electron turns out to be the best NodeJS debugger.


### Experimental: TypeScript

Should use TypeScript nightly. The upcoming 1.8 has better support for JavaScript modules.

+ https://github.com/Microsoft/TypeScript/pull/5471

Run this command to configure VSCode:

```
qpack setup
```

Note: To force VSCode to use a particular version of TypeScript language service, see http://stackoverflow.com/a/32380584