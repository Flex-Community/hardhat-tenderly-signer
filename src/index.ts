import { extendConfig, extendProvider } from "hardhat/config";

import "hardhat/types/config";

// We need to declare an extension to the HardhatConfig type to add our plugin's config.
declare module "hardhat/types/config" {
  interface HardhatNetworkUserConfig {
    tenderlySignerAddress?: string[];
  }

  interface HardhatNetworkConfig {
    tenderlySignerAddress?: string[];
  }

  interface HttpNetworkUserConfig {
    tenderlySignerAddress?: string[];
  }
  interface HttpNetworkConfig {
    tenderlySignerAddress?: string;
  }

  interface HardhatUserConfig {}

  interface HardhatConfig {}
}

extendConfig((config, userConfig) => {
  for (const networkName of Object.keys(config.networks)) {
    config.networks[networkName].tenderlySignerAddress =
      userConfig.networks?.[networkName]?.tenderlySignerAddress;
  }
});

extendProvider(async (provider, config, network) => {
  const { TenderlySignerProvider } = await import("./tenderly-sign-provider");
  if (!config.networks[network].tenderlySignerAddress) {
    return provider;
  }
  return new TenderlySignerProvider(
    config.networks[network].tenderlySignerAddress as string,
    provider,
  );
});
