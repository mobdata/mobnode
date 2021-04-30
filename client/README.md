# Mobnode Client

Mobnode client for interacting with the Mobnode API. Written in [React](https://reactjs.org/) using [create-react-app](https://github.com/facebookincubator/create-react-app)!

## File Structure

```
.
├── public
└── src
    ├── components
    │   ├── AppDialog
    │   ├── AppDrawer
    │   └── Table
    ├── modules
    │   ├── App
    │   ├── Nodes
    │   │   └── components
    │   │       ├── AddColumnForm
    │   │       ├── NodeDrawer
    │   │       └── NodeTable
    │   └── Rule
    │       └── components
    │           └── RuleEditor
    ├── routes
    └── util

18 directories

```

The file structure above is an example file structure of what the project should mostly look like.

The main application components which are global or reusable to the entire app reside in `src/components`.

All of the context specific components, actions, and reducers reside in their respective `src/modules` folder. For example, all of the UI rendered to represent the node data reside in `src/modules/nodes`.

## Usage

### Development

To start development, simply run with `yarn` or `npm`.

### Production

To build an optimized, production ready application, simply run `yarn build`.