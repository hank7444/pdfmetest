# Build

- Clone the repository
- install dependency with `npm install`
- build the packages with `npm run build`

```cmd
[in pdfme dir] $ npm install
[in pdfme dir] $ npm run build
```

At this point, to check if the build is done correctly, let's execute `npm run test` once. This will call the test suites for each package.

```cmd
[in pdfme dir] $ npm run test
```


# Publish
After the build and tests are complete, you need to publish the built packages. Specifically, go to the following directories and publish the contents under dist/:

```cmd
[in pdfme/packages/common] $ npm publish --access public
[in pdfme/packages/ui]     $ npm publish --access public
```

Make sure you're in the correct folder (packages/common or packages/ui) before running the publish command. This will upload the contents of dist/ to npm.


# Versioning
We're using version 5.2.16 as the base. Any internal updates should follow the custom versioning format: 
```cmd
5.2.16.x
```

For example:
- First internal update: 5.2.16-internal.1
- Second internal update: 5.2.16-internal.2

Before publishing, make sure to update the version field in each package.json file accordingly.