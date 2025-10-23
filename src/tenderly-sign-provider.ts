import { ProviderWrapperWithChainId } from "hardhat/internal/core/providers/chainId";
import {
  EIP1193Provider,
  RequestArguments,
} from "hardhat/types";
import {
  HardhatTenderlySignerError,
} from "./errors";
import * as readline from "readline";

function askForConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer: string) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

export class TenderlySignerProvider extends ProviderWrapperWithChainId {
  tenderlySignerAddress?: string;

  constructor(
    tenderlySignerAddress: string,
    _wrappedProvider: EIP1193Provider,
  ) {
    super(_wrappedProvider);

    this.tenderlySignerAddress = tenderlySignerAddress;
  }

  private async _ethSendTransaction(params: any[]): Promise<string> {
    const provider: EIP1193Provider = this._wrappedProvider;
    const url = (provider as any).url;

    if (!url) {
      throw new Error("Provider URL is not available");
    }

    const transactionParams = params[0];

    // Display transaction details
    console.group("Transaction Details");
    console.log("Data:");
    console.log(transactionParams.data || "0x");
    console.log(
      `(${transactionParams.data ? transactionParams.data.length : 2} characters)`,
    );
    console.log(`From: ${transactionParams.from}`);
    console.log(`To: ${transactionParams.to || "contract deployment"}`);
    console.log(
      `Value: ${transactionParams.value || "0x0"} (${parseInt(transactionParams.value || "0x0", 16)} wei)`,
    );
    console.log(
      `Gas Limit: ${transactionParams.gas || transactionParams.gasLimit || "auto"}`,
    );
    console.log(`Gas Price: ${transactionParams.gasPrice || "auto"}`);
    if (transactionParams.maxFeePerGas) {
      console.log(`Max Fee Per Gas: ${transactionParams.maxFeePerGas}`);
    }
    if (transactionParams.maxPriorityFeePerGas) {
      console.log(
        `Max Priority Fee Per Gas: ${transactionParams.maxPriorityFeePerGas}`,
      );
    }
    console.groupEnd();

    // Ask for user confirmation
    const confirmed = await askForConfirmation(
      `Do you want to send transaction from ${this.tenderlySignerAddress} to ${transactionParams.to || "contract deployment"}? (y/N): `,
    );

    if (!confirmed) {
      throw new Error("Transaction cancelled by user");
    }

    const requestBody = {
      id: 1,
      jsonrpc: "2.0",
      method: "eth_sendTransaction",
      params: [transactionParams],
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(`RPC error: ${result.error.message}`);
      }

      console.log("Transaction sent successfully:", result.result);
      return result.result;
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  }

  public async request(args: RequestArguments): Promise<unknown> {
    if (args.method === "eth_accounts") {
      return [this.tenderlySignerAddress];
    }

    try {
      const params = this._getParams(args);
      if (args.method === "eth_sign") {
        throw new HardhatTenderlySignerError("eth_sign is not Implemented");
      } else if (args.method === "personal_sign") {
        throw new HardhatTenderlySignerError(
          "personal_sign is not Implemented",
        );
      } else if (args.method === "eth_signTypedData_v4") {
        throw new HardhatTenderlySignerError(
          "eth_signTypedData_v4 is not Implemented",
        );
      } else if (args.method === "eth_sendTransaction") {
        return await this._ethSendTransaction(params);
      }
    } catch (error) {
      console.error("TenderlySignerProvider Error:", error);
      throw error;
    }

    return this._wrappedProvider.request(args);
  }
}
