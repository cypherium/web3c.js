
# web3c.js - Cypherium JavaScript API

You need to run a local [Cypherium](https://github.com/cypherium/cypherBFTBin.git) node or remote `https://pubnodes.cypherium.io` to use this library.

Please read the [documentation][https://github.com/cypherium/cypherBFTBin/blob/main/doc/cypherium-rpc-api.docx] for more.

## Installation

### Node

```bash
npm install @cypherium/web3c
```



### In the Browser

Use the prebuilt `dist/web3c.min.js`, or
build using the [web3c.js][repo] repository:

```bash
npm run build
```

Then include `dist/web3c.min.js` in your html file.
This will expose `Web3c` on the window object.


## Usage

```js
// In Node.js
const Web3c = require('@cypherium/web3c');

let web3c = new Web3c('ws://localhost:8000');
console.log(web3c);
> {
    cph: ... ,
    shh: ... ,
    utils: ...,
    ...
}
```

Additionally you can set a provider using `web3c.setProvider()` (e.g. WebsocketProvider):

```js
web3c.setProvider('ws://localhost:8000');
// or
web3c.setProvider(new Web3c.providers.WebsocketProvider('ws://localhost:8000'));

```

There you go, now you can use it:

```js
web3c.cph.getAccounts().then(console.log);
```

### Usage with TypeScript

We support types within the repo itself. Please open an issue here if you find any wrong types.

You can use `web3c.js` as follows:

```typescript
import Web3c from '@cypherium/web3c';
const web3c = new Web3c('ws://localhost:8000');
```

If you are using the types in a `commonjs` module, like in a Node app, you just have to enable `esModuleInterop` and `allowSyntheticDefaultImports` in your `tsconfig` for typesystem compatibility:

```js
"compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    ....
```

### Connect to public nodes
import Web3c from '@cypherium/web3c';
```connect to pubnodes.cypherium.io
web3c = new Web3c(new Web3c.providers.HttpProvider('https://pubnodes.cypherium.io');
```


## Building

### Requirements

-   [Node.js](https://nodejs.org)
-   [npm](https://www.npmjs.com/)

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
```

### Building (webpack)

Build the web3c.js package:

```bash
npm run build
```

