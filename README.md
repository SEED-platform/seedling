# SEED<small>LING</small>

SEED<small>LING</small> is an offline tool to help generate Covered Buildings Lists for use with the [SEED Platform](https://seed-platform.org/).

## Getting Started

Clone this repository locally :

``` bash
git clone https://github.com/seed-platform/seedling.git
```

Install dependencies with npm :

``` bash
npm install
```

It is also advisable to generate Angular components with the Angular CLI:

``` bash
npm install -g @angular/cli
```

## To build for development

``` bash
npm start
```

In development the Electron app may launch before Angular has finished compiling the UI, so you may have to reload the Electron view once Angular reports that the http-server is running.

## package.json Scripts

|Command|Description|
|--|--|
|`npm run start`| Execute the app with hot-reload in an Electron app |
|`npm run electron:build`| Builds the OS-specific installer and bundled UI |
