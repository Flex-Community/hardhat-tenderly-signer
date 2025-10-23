# []()hardhat-tenderly-signer

A Hardhat plugin to submit unsigned transactions to Tenderly.

# Installation

```bash
yarn add https://github.com/Flex-Community/hardhat-tenderly-signer.git
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
      tenderlySignerAddress: "0x1111111222233333333333333333333333333333", // Enable transaction without signing
      // Remove accounts field
      // accounts: [...] - 
    },
  },
};
```
