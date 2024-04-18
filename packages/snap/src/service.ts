import {
  fetchBalanceFromLineascan,
  fetchLxpActivations,
  fetchPohStatus,
} from './api';
import {
  convertBalanceToDisplay,
  LXP_CONTRACT_ADDRESS,
  LXP_L_CONTRACT_ADDRESS,
} from './utils';

/**
 * Get the LXP balance for an address from Lineascan.
 * @param tokenAddress - The address of the token contract.
 * @param address - The address to get the LXP balance for.
 * @returns The LXP balance for the address.
 */
async function getTokenBalanceFromLineascan(
  tokenAddress: string,
  address: string,
) {
  let rawBalance;

  try {
    rawBalance = await fetchBalanceFromLineascan(tokenAddress, address);
    return convertBalanceToDisplay(rawBalance);
  } catch (error) {
    return 0;
  }
}

/**
 * Get token balance for an address from the chain.
 * @param tokenAddress - The address of the token contract.
 * @param address - The address to get the LXP balance for.
 * @returns The LXP balance for the address.
 */
async function getTokenBalanceFromChain(tokenAddress: string, address: string) {
  const method = 'eth_call';
  const params = [
    {
      to: tokenAddress,
      data: `0x70a08231000000000000000000000000${address.slice(2)}`,
    },
    'latest',
  ];

  const rawBalance = await ethereum.request<string>({ method, params });

  return convertBalanceToDisplay(rawBalance);
}

/**
 * Get the LXP balance for an address.
 * @param address - The address to get the LXP balance for.
 * @param chainId - The chain ID.
 * @returns The LXP balance for the address.
 */
export async function getLxpBalanceForAddress(
  address: string,
  chainId: string,
) {
  if (!address) {
    return 0;
  }
  if (chainId === '0xe708') {
    return getTokenBalanceFromChain(LXP_CONTRACT_ADDRESS, address);
  }
  return getTokenBalanceFromLineascan(LXP_CONTRACT_ADDRESS, address);
}

/**
 * Get the LXP-L balance for an address.
 * @param address - The address to get the LXP-L balance for.
 * @param chainId - The chain ID.
 * @returns The LXP balance for the address.
 */
export async function getLxpLBalanceForAddress(
  address: string,
  chainId: string,
) {
  if (!address) {
    return 0;
  }
  if (chainId === '0xe708') {
    return getTokenBalanceFromChain(LXP_L_CONTRACT_ADDRESS, address);
  }
  return getTokenBalanceFromLineascan(LXP_L_CONTRACT_ADDRESS, address);
}

/**
 * Get the POH status for an address.
 * @param address - The address to get the POH status for.
 * @returns The POH status for the address.
 */
export async function getPohStatus(address: string) {
  if (!address) {
    return false;
  }

  try {
    const pohStatus = await fetchPohStatus(address);
    return pohStatus.poh as boolean;
  } catch (error) {
    return false;
  }
}

/**
 * Get the current activations.
 * @returns The current activations.
 */
export async function getCurrentActivations() {
  try {
    return fetchLxpActivations();
  } catch (error) {
    return [];
  }
}
