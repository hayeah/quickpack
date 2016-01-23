# A Zero Config Webpack Packager

Most frontend projects are pretty much the same, and it'd probably be easier to maintain the packager as a package that could be shared by all the frontend projects.

```
quickpack a=./bar.js b=./baz.js  ... <outputDir>
```

The following features are baked in:

+ PostCSS + AutoPrefixer.
+ URL Loader.
+ Babel ES6 & React.
+ Long-term caching.

(Work in progress)

# TypeScript [experimental]

Should use TypeScript nightly. 1.8 has better support for JavaScript modules.

+ https://github.com/Microsoft/TypeScript/pull/5471

QuickPack uses TypeScript 1.8 to compile `.ts` files. Run this command to configure VSCode:

```
qpack setup
```

Note: To force VSCode to use a particular version of TypeScript language service, see http://stackoverflow.com/a/32380584