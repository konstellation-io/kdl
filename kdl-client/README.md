# Electron App

## Available Scripts

Before using the scripts you need to add a `.env` file with the following content:

```bash
SASS_PATH=src
```

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode (it will be opened in a new window).

The page will reload if you make edits.

You will also see any lint errors in the console.

See [Working in development mode](#working-in-development-mode).

### `yarn gen:types`

Generates Typescript interfaces for graphql queries includes inside Graphql directory.

Generated types will be included inside a `types` folder located among the scanned queries.

### `yarn build`

Builds the app for production to the `build` folder.

This build will be used when publishing the app.

### `yarn local-release`

Builds the app and generates an AppImage for Linux inside a `release` directory. Use this to test wether the App builds correctly or not.

## Working in Development Mode

### Starting the app

In order to work in Development Mode you need to both start the app using the command `yarn build dev` and to start the mock server.

To start the mock server, use the following command inside the directory `mock server`:

```bash
yarn start
```

### Connection between pieces

Electron app will connect to the mock server when retrieving information related with an opened cluster. If you are not going to work with projects (or an open cluster), you can skip the mock server step.

For the remaining views, the app uses a file to store the information regarding stored clusters.

## Publishing the application

The Electron app is published automatically by the use of Github actions, so you do not need to do extra steps to perform this action.

When using semantic commits, new versions will be generated and when merging code to `main`, a version will be realeased with the updated application installers/images.

More info about sematic versioning: [semantic-release](https://github.com/semantic-release/semantic-release)
More info about electron builder action: [action-electron-builder](https://github.com/samuelmeuli/action-electron-builder)
