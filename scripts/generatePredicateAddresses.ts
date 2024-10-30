import * as fs from 'node:fs';
import path from 'node:path';
import {
  EthereumWalletAdapter,
  type PredicateConfig,
} from '../packages/common';
import { PredicateFactory } from '../packages/common';
import { MockProvider } from '../packages/evm-connector/src/test/mockProvider';

import {
  abi as predicateAbi,
  bin as predicateBin,
  generationDate as predicateGenerationDate,
} from '../packages/evm-connector/src/generated/predicates/0xfdac03fc617c264fa6f325fd6f4d2a5470bf44cfbd33bc11efb3bf8b7ee2e938';

// Define the predicate versions
const PREDICATE_VERSIONS = {
  '0xfdac03fc617c264fa6f325fd6f4d2a5470bf44cfbd33bc11efb3bf8b7ee2e938': {
    predicate: {
      abi: predicateAbi,
      bin: predicateBin,
    },
    generatedAt: predicateGenerationDate,
  },
};

// List of EVM addresses to generate predicate addresses for
const evmAddresses = [
  '0x52d7792d70E15dC6eDDb8Dc907c06D3b8247aEbe',
  // Add more addresses here
];

async function generatePredicateAddresses() {
  // Create mock provider instance
  const _mockProvider = new MockProvider();

  const results = evmAddresses.map((evmAddress) => {
    const predicate = Object.values(PREDICATE_VERSIONS)[0]
      ?.predicate as PredicateConfig;
    const predicateFactory = new PredicateFactory(
      new EthereumWalletAdapter(),
      predicate,
      '',
    );
    const predicateAddress = predicateFactory.getPredicateAddress(evmAddress);
    return {
      evmAddress,
      predicateAddress,
    };
  });

  // Log to console
  console.log('\nEVM to Predicate Address Mappings:');
  results.forEach(({ evmAddress, predicateAddress }) => {
    console.log(`EVM: ${evmAddress} -> Predicate: ${predicateAddress}`);
  });

  // Write to file
  const outputPath = path.join(
    __dirname,
    '../generated/predicate-addresses.json',
  );

  // Ensure the directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nResults written to: ${outputPath}`);
}

// Execute the script
generatePredicateAddresses();
