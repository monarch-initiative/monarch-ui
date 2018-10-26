## monarch-ui

This repository contains the Monarch Initiative web application.

## Development Prerequisites (move to CONTRIBUTING.md)

### Mac users without `homebrew`

If you don't have [homebrew](https://brew.sh) installed, you should install it.

### Mac users with `homebrew`

If you have `homebrew` installed, but haven't run it in a while, you should update it with:

- `brew update`
- `brew upgrade`

If the above update/upgrade instructions do not work, it may mean that you have upgraded MacOSX to High Sierra or beyond, and the older version of homebrew isn't able to auto-update itself. MacOSX High Sierra and beyond have modified the default security settings and file permissions so that older versions of `homebrew` may not work correctly and may not even update. If this appears to have happened to you, you will need to uninstall the old version and install the latest `homebrew`. See [FAQ](https://docs.brew.sh/FAQ) and search for 'How do I uninstall Homebrew?', which says that you should uninstall via the following:

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"
```

### Mac/Unix users should install `nvm`

[nvm - Node Version Manager](https://github.com/creationix/nvm) is used to ensure that you are running the correct version of NodeJS. The instructions at [Installation](https://github.com/creationix/nvm#installation) should be sufficient for Mac/Unix. Mac users can alternatively use `homebrew` as described below).

#### Easy Install of `nvm` via `homebrew` on Mac

You can use `brew install nvm` to install `nvm`, saving yourself a lot of hassle if it works right. See [How to install NVM (Node Version Manager) with Homebrew](https://www.wdiaz.org/how-to-install-nvm-with-homebrew/).

### Update to NodeJS v8.12.0 using `nvm`

We are currently relying upon NodeJS v8.12.0. The default NodeJS installation may be an earlier version, which is why we use `nvm`:

- `nvm install v8.12.0`
- `nvm use v8.12.0`


### Before committing

- `npm run build` to update `/docs` directory
- Make sure you commit '/docs'

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Run your unit tests

```
npm run test:unit
```

### Run your end-to-end tests

```
npm run test:e2e
```
