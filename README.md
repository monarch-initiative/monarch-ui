## monarch-ui README

This repository contains the source code for the Monarch Initiative web application (aka, the Monarch UI).

This README describes the application and its interaction with Monarch Initiative services such as BioLink. It also provide a Quickstart on how to build and run the application.

For detailed information on the structure of the code and how to contribute, see [CONTRIBUTING.md](./CONTRIBUTING.md).

<!-- MarkdownTOC -->

- [Overall Architecture](#overall-architecture)
	- [BioLink Service](#biolink-service)
- [Directory Structure](#directory-structure)
	- [`monarch-ui/`](#monarch-ui)
		- [`monarch-ui/dist/`](#monarch-uidist)
		- [`monarch-ui/public/`](#monarch-uipublic)
		- [`monarch-ui/src/`](#monarch-uisrc)
		- [`monarch-ui/src/main.js`](#monarch-uisrcmainjs)
		- [`monarch-ui/src/App.vue`](#monarch-uisrcappvue)
		- [`monarch-ui/src/router.js`](#monarch-uisrcrouterjs)
		- [`monarch-ui/src/style/`](#monarch-uisrcstyle)
		- [`monarch-ui/src/api/`](#monarch-uisrcapi)
		- [`monarch-ui/src/lib/`](#monarch-uisrclib)
		- [`monarch-ui/src/assets/img/`](#monarch-uisrcassetsimg)
		- [`monarch-ui/src/component/`](#monarch-uisrccomponent)
		- [`monarch-ui/src/views/`](#monarch-uisrcviews)
	- [Markdown-based Components](#markdown-based-components)
- [QuickStart](#quickstart)
	- [Obtaining the source code](#obtaining-the-source-code)
	- [Environment setup](#environment-setup)
	- [Project setup](#project-setup)
	- [Local Development: Fast Compile and hot-reload](#local-development-fast-compile-and-hot-reload)
- [Production Build: Bundling and Minification](#production-build-bundling-and-minification)
- [Production Test: Build and Serve](#production-test-build-and-serve)
- [Linting](#linting)
- [Testing](#testing)
	- [Run your unit tests](#run-your-unit-tests)
	- [Run your end-to-end tests](#run-your-end-to-end-tests)
	- [Run both types of test](#run-both-types-of-test)

<!-- /MarkdownTOC -->

### Overall Architecture

The UI is a VueJS single-page application that is loaded into the browser as a static set of Javascript, HTML, CSS, and media resources. Subsequent dynamic data is delivered to the browser via `XMLHttpRequest` calls to various backend services, primarily [BioLink](https://api-biolink.monarchinitiative.org). The data returned from these calls is then displayed appropriately in the web application.

- Source: https://github.com/monarch-initiative/monarch-ui
- Monarch Initiative UI: https://monarchinitiative.org
- [BioLink](https://api-biolink.monarchinitiative.org) service to access Monarch's data

The VueJS application is built from source code via a modern chain of tools that deal with resource bundling, minification, and transpilation:

- [VueJS](https://vuejs.org) UI Rendering framework
- [BootstrapVue](https://bootstrap-vue.js.org) styling framework
- [vue-cli](https://cli.vuejs.org) for build and asset management
- [webpack](https://webpack.js.org) for asset bundling

The output of the build process is a set of static files including bundled Javascript, CSS, HTML and other media assets. These are then deployed to Netlify where they can be served to users on the internet.


### BioLink Service

There are multiple versions of the BioLink service.
See the top of the BioLink file in `/api` for what versions are available.

To easily switch between these versions in the live web-app, add a parameter to your current url like `?api=beta`.


### Directory Structure

#### `monarch-ui/`

- `package.json` lists build-time and run-time dependencies and a list of `npm run`-able scripts such as `npm run dev`.
- `vue.config.js` is the configuration that is used by `vue-cli` to dynamically generate the configuration needed by `webpack`, which is invoked *behind the scenes* by `vue-cli`.
- `publish.sh` is a convenience script invoked by `npm run ghpublish` to copy the developer's current directory into their `gh-pages` branch and then pushing that to `origin`.
- `babel.config.js` configures the [Babel](https://babeljs.io) compiler that translates modern Javascript into browser-compatible Javascript.
- `.eslintrc.js` specifies the linting rules used by [eslint](https://eslint.org) to ensure that code is authored in a more uniform and safe way.

##### `monarch-ui/dist/`

This directory contains the output of the build process (e.g., from `npm run build` or `npm run ghpublish`). The files here should never be placed in source control or edited; they are generated files. Upon first downloading the repo, or after `npm run clean`, this directory may not exist.

##### `monarch-ui/public/`

The `vue-cli` workflow specifies that the contents of `public/` are copied verbatim to the build output directory `dist/`, and therefore made available to running web application.

- `team.yaml` describes the persons and institutions that make up the Monarch project. This is used by `AboutTeam.md` to render a Team page.
- `news.yaml` is used to drive the `HomeNews.md` component.
- `robots.txt` is used to guide or exclude web-crawling robots. See [Robots.txt](https://moz.com/learn/seo/robotstxt).
- `index.html` is *transformed* by the build workflow to generate a corresponding `dist/index.html`. It is NOT copied verbatim.
- `mondo_ids.txt` is a tab-demimited list of "Diseases of the Month" for all 12 months of the year. It is used to populate the Featured Diseases carousel on the home page. The first field is the Mondo ID; the second indicates which month to display the disease, formatted as YYYY-MM-DD.


##### `monarch-ui/src/`

This directory and the `monarch-ui/public/` (see above) directory contains the primary HTML, Javascript, and CSS source code that will be used to build the web application assets in `monarch-ui/dist/`.

##### `monarch-ui/src/main.js`

By convention, `vue-cli` will use `src/main.js` as its main entry point. This file performs any global initialization, including the Vue router and the main `App.vue`.

##### `monarch-ui/src/App.vue`

By convention, `App.vue` is the root VueJS component that is usually bound to a `div` in the `public/index.html` file. This is a good place to configure VueJS and register global components.


##### `monarch-ui/src/router.js`

This file `router.js` is where the `vue-router` is loaded and configured.


##### `monarch-ui/src/style/`

This file contains `SCSS` or `CSS` files that might need to be included in several components.

The most important file here is `variables.scss`, which can be included in every component via:

```
<style lang="scss">
@import "~@/style/variables";
...
</style>
```

##### `monarch-ui/src/api/`

We've tried to isolate external network API access into this directory, so that the rest of the UI can be unaware of the protocol and network issues inherent in making `XMLHttpRequest` or `axios` calls. For example, `api/bio-link.js` is the module that makes REST calls to the BioLink server, and the rest of the UI simply imports from `api/bio-link.js`. For example:

```javascript
import * as BL from '@/api/bio-link';
// ...
const promise = BL.getNeighborhood(this.nodeId, this.nodeType);
```

##### `monarch-ui/src/lib/`

This directory is for non-UI utility code that does not access external network APIs (which would be located in `src/api/`).

##### `monarch-ui/src/assets/img/`

Assets that will be bundled by webpack by `require` or `import`. E.g., `require('../assets/img/icon-models.png')`


##### `monarch-ui/src/component/`
##### `monarch-ui/src/views/`

Both `components/` and `views/` are properly VueJS components. However, by convention, we isolate top-level routable components into the `views/` directory. Both component types are typically just VueJS Single-file Components with extension `.vue`. In some cases, they will have a `.md` extension, which means they will be scanned for Markdown prior to *becoming* VueJS components. See [Markdown-based Components](#markdown-based-components) below for more information about Markdown in components.

#### Markdown-based Components

In an attempt to make it easier for non-developers to contribute enhancements to the *prose* within the application, we've enabled the capability to define VueJS components that contain Markdown text in their `<template>`. These files with extension `.md` (e.g., `views/AboutMonarch.md`) are processed at build-time by `loaders/vue-markdown-loader-improved.js`, which will find Markdown fragments within the template and will translate them (at build-time) into HTML.


### QuickStart

In order to build the application locally, you will need to obtain the source code and follow the QuickStart instructions below.

#### Obtaining the source code

If your intent is to eventually contribute source code to the project via *pull requests*, then we recommend that you first *fork* the `monarch-ui` repo and then *git clone* this fork to your local development machine. Details on using the *GitHub Flow* workflow for contributing to open source projects are provided in [CONTRIBUTING](./CONTRIBUTING.md)

For example, if your GitHub username is `abc`, and you've forked the `monarch-ui` repo to your user, then you can get a local copy of your forked repo with (assuming that `monarch_stuff` exists on your machine)

```
cd monarch_stuff/
git clone git@github.com:abc/monarch-ui.git
cd monarch_ui/
```


For simple *evaluation* or *testing* of the `monarch-ui`, then cloning the primary repo at [monarchinitiative/monarch-ui](https://github.com/monarchinitiative/monarch-ui) should be sufficient. You will not be able to submit pull requests if you take this route, however.


```
cd monarch_stuff/
git clone https://github.com/monarch-initiative/monarch-ui.git
cd monarch_ui/
```

#### Environment setup

There may be some one-time installation of tools, depending upon whether you have the supported version of NodeJS running. NodeJS v8.12.0 is currently supported, although the project will likely build fine with later versions of NodeJS. If the following command fails, then you probably do not have NodeJS installed:

```bash
node -v
```

If the above command fails or if it reports a version number significantly different from `v8.12.0`, then you should install [nvm - Node Version Manager](https://github.com/nvm-sh/nvm) and then install a compatible version of NodeJS.

In the event that you do not already have a compatible version of NodeJS installed, we have provided detailed instructions at the end of the `CONTRIBUTING` document here [Installing NodeJS](CONTRIBUTING.md#installing-nodejs).

#### Project setup

Whenever you update your local development machine's source code, and upon initially cloning the repository, you will need to run the following `npm install` command, which will read the latest downloaded `package.json` and ensure that your local dependencies are up to date.

```
npm install
```

#### Local Development: Fast Compile and hot-reload

The following command will run `webpack` in *development* mode, which runs a `webpack-dev-server` that detects source code changes and rebuilds the application dynamically and delivers these changes to the browser via *hot reload*, which often allows the UI to be updated without a full page reload. This speeds up a developer's iterations immensely.

```
npm run serve
```

The command `npm run dev` is an alias for `npm run serve`, mostly for the convenience of folks who are used to `npm run dev`.


### Production Build: Bundling and Minification

In contrast to `npm run serve` above, which is designed to quickly build and demonstrate changes to the source code, the `npm run build` command will be more exhaustive in optimizing the build, and will produce a set of assets (Javascript, HTML, CSS, media) that are suitable for deployment to a web server.


```
npm run build
```

### Production Test: Build and Serve

Although there shouldn't be any difference in behavior between `development` and `production` mode builds, there sometimes are. So it has proven convenient to be able to test the `production` build locally, which is why the `npm run buildandserve` command was added:

```
npm run buildandserve
```


### Linting

Usually, we are editing code with a text editor (e.g., SublimeText) that works with ESLint and highlights any linting errors discovered as we edit. It is also possible to manually run ESLint over the entire source. This is a good idea to do before finalizing your code submission.

```
npm run lint
```


### Testing

#### Run your unit tests

```
npm run test:unit
```

#### Run your end-to-end tests

```
npm run test:e2e
```


#### Run both types of test

```
npm run test
```
