import { extendConfig, extendProvider } from "hardhat/config";

import "hardhat/types/config";

// We need to declare an extension to the HardhatConfig type to add our plugin's config.
declare module "hardhat/types/config" {
  interface HardhatNetworkUserConfig {
    tendrlySignerAddress?: string[];
  }

  interface HardhatNetworkConfig {
    tendrlySignerAddress?: string[];
  }

  interface HttpNetworkUserConfig {
    tendrlySignerAddress?: string[];
  }
  interface HttpNetworkConfig {
    tendrlySignerAddress?: string;
  }

  interface HardhatUserConfig {}

  interface HardhatConfig {}
}

extendConfig((config, userConfig) => {
  for (const networkName of Object.keys(config.networks)) {
    config.networks[networkName].tendrlySignerAddress =
      userConfig.networks?.[networkName]?.tendrlySignerAddress;
  }
});

extendProvider(async (provider, config, network) => {
  const { TenderlySignerProvider } = await import("./tenderly-sign-provider");
  if (!config.networks[network].tendrlySignerAddress) {
    return provider;
  }
  return new TenderlySignerProvider(
    config.networks[network].tendrlySignerAddress as string,
    provider,
  );
});
