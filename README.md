# Mobnode

Web interface for defining rules to control outbound replication.

## Usage

Below are instructions to build Mobnode for both development and production.

### Environment Variables

Each of the directories require their own respective environment variables. Please reference the `README.md` of each directory.

### Development

The current directory structure includes both the client Javascript application and the Node/Express API, located in `client/` and `server/` respectively.

This means that each directory has their own respective `package.json` which dictates the application's dependencies. This means you must `npm install` or `yarn install` in each respective directory.

```shell
$ yarn install
...
$ cd client
$ yarn install
...
$ cd ../server
$ yarn install
```

While this is cumbersome for the time-being, this will soon be changed when the server APIs for both Mobnode and Mobboss are unified. More specifically, Mobnode will become strictly a client side application that interactes with a generic Mobdata API built to the user's specification.

## Server

For information on the Mobnode server, please visit [here](./server/README.md).

## Client

For information on the Mobnode client, please visit [here](./client/README.md).