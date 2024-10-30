import * as fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
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

// Hardcoded fallback addresses
const hardcodedAddresses = [
  '0x52d7792d70E15dC6eDDb8Dc907c06D3b8247aEbe',
  // Add more addresses here
];

// Try to read and parse CSV file
let evmAddresses: string[] = [];
try {
  const csvFilePath = path.join(__dirname, 'data/data.csv');
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  // Extract ETH addresses from CSV
  evmAddresses = records
    .filter((record: CSVRecord) => record['Eth Wallet'])
    .map((record: CSVRecord) => record['Eth Wallet']);

  // If no addresses found in CSV, use hardcoded values
  if (evmAddresses.length === 0) {
    evmAddresses = hardcodedAddresses;
  }
} catch (_error) {
  console.log('Failed to read CSV file, using hardcoded addresses instead');
  evmAddresses = hardcodedAddresses;
}

// Add these interfaces near the top of the file
interface CSVRecord {
  'Eth Wallet': string;
  'Fuel Wallet': string;
  [key: string]: string; // For any additional fields
}

interface AddressMapping {
  [key: string]: string;
}

async function generatePredicateAddresses() {
  // Create mock provider instance
  const _mockProvider = new MockProvider();

  const results = evmAddresses.map((evmAddress: string) => {
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

  // Create mapping of ETH address to predicate address
  const addressMapping = results.reduce(
    (acc: AddressMapping, curr: PredicateResult) => {
      acc[curr.evmAddress.toLowerCase()] = curr.predicateAddress;
      return acc;
    },
    {} as AddressMapping,
  );

  // Try to read the original CSV to maintain all data
  let originalRecords = [];
  try {
    const csvFilePath = path.join(__dirname, 'data/data.csv');
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    originalRecords = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  } catch (_error) {
    console.log('No existing CSV file found, creating new records');
    // Create basic records from hardcoded addresses
    originalRecords = hardcodedAddresses.map((address) => ({
      'Fuel Wallet': '',
      'Eth Wallet': address,
    }));
  }

  // Enrich the original records with predicate addresses
  const enrichedRecords = originalRecords.map((record: CSVRecord) => ({
    ...record,
    'Fuel Wallet': record['Eth Wallet']
      ? addressMapping[record['Eth Wallet'].toLowerCase()]
      : record['Fuel Wallet'],
  }));

  // Write JSON file
  const outputPath = path.join(
    __dirname,
    '../generated/predicate-addresses.json',
  );
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  // Write CSV file
  const outputPathCSV = path.join(__dirname, 'data/formatted-data.csv');
  const csvString = stringify(enrichedRecords, {
    header: true,
  });
  fs.writeFileSync(outputPathCSV, csvString);

  // Log results
  console.log('\nEVM to Predicate Address Mappings:');
  // Define an interface for the result type
  interface PredicateResult {
    evmAddress: string;
    predicateAddress: string;
  }

  // Update the forEach callback with proper typing
  results.forEach(({ evmAddress, predicateAddress }: PredicateResult) => {
    console.log(`EVM: ${evmAddress} -> Predicate: ${predicateAddress}`);
  });
  console.log(`\nResults written to: ${outputPath}`);
  console.log(`CSV written to: ${outputPathCSV}`);
}

// Execute the script
generatePredicateAddresses();
