import { NomicLabsHardhatPluginError } from "hardhat/plugins";

export class HardhatTenderlySignerError extends NomicLabsHardhatPluginError {
  constructor(message: string, parent?: Error) {
    super("@flex-community/hardhat-tenderly-signer", message, parent);
  }
}
