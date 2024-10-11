import { type AppKitNetwork, mainnet, sepolia } from '@reown/appkit/networks';

export const DEFAULT_PROJECT_ID = '00000000000000000000000000000000';
export const ETHEREUM_ICON =
  'data:image/svg+xml;utf8;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNTMgMzM1LjEyMkwyNTUuODg2IDMzOEwzODggMjU5Ljk4N0wyNTUuODg2IDQxTDI1MyA1MC43OTgzVjMzNS4xMjJaIiBmaWxsPSIjMzQzNDM0Ii8+CjxwYXRoIGQ9Ik0yNTYgMzM4VjQxTDEyNCAyNTkuOTg2TDI1NiAzMzhaIiBmaWxsPSIjOEM4QzhDIi8+CjxwYXRoIGQ9Ik0yNTQgNDY1LjI4MUwyNTUuNjI4IDQ3MEwzODggMjg1TDI1NS42MjkgMzYyLjU2M0wyNTQuMDAxIDM2NC41MzJMMjU0IDQ2NS4yODFaIiBmaWxsPSIjM0MzQzNCIi8+CjxwYXRoIGQ9Ik0xMjQgMjg1TDI1NiA0NzBWMzYyLjU2MkwxMjQgMjg1WiIgZmlsbD0iIzhDOEM4QyIvPgo8cGF0aCBkPSJNMjU2IDIwMFYzMzhMMzg4IDI1OS45ODhMMjU2IDIwMFoiIGZpbGw9IiMxNDE0MTQiLz4KPHBhdGggZD0iTTI1NiAyMDBMMTI0IDI1OS45ODhMMjU2IDMzOFYyMDBaIiBmaWxsPSIjMzkzOTM5Ii8+Cjwvc3ZnPgo=';
export const TESTNET_URL = 'https://testnet.fuel.network/v1/graphql';

// 1 minute timeout for request signature
export const SINGATURE_VALIDATION_TIMEOUT = 1000 * 60;

export const HAS_WINDOW = typeof window !== 'undefined';
export const WINDOW = HAS_WINDOW ? window : null;
export const DEFAULT_NETWORKS: [AppKitNetwork, ...AppKitNetwork[]] = [
  mainnet,
  sepolia,
];
