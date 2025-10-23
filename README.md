# []()hardhat-tenderly-signer

Hardhat plugin for sending transactions for Tenderly without signature

# Installation

```bash
yarn add git+https://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:x-oauth-basic@github.com/Flex-Community/hardhat-tenderly-signer.git#main
```

# Usage (Example only)

1. import the plugin in your `hardhat.config.js`

```js
import "flex-community/hardhat-tenderly-signer";
```

or

```js
require("flex-community/hardhat-tenderly-signer");
```

3. add the plugin configuration in your `hardhat.config.js`

```js
import { HardhatUserConfig } from "hardhat/config";

//...

// Enable in config for tenderly:
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    tenderly: {
      url: "https://virtual.base.rpc.tenderly.co/...",
      tendrlySignerAddress: "0x1111111222233333333333333333333333333333", // Enable transaction without signing
    },
  },
};
```
