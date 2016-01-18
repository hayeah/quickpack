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

