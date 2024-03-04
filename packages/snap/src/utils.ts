import { ManageStateOperation } from '@metamask/snaps-sdk';

import type { Attestation } from './types';

/**
 * Get the address of the connected wallet.
 * @returns The address of the connected wallet.
 */
export async function getAccount() {
  const accounts = await ethereum.request<string[]>({
    method: 'eth_requestAccounts',
  });

  if (!accounts || accounts.length === 0 || !accounts[0]) {
    throw new Error('Something went wrong while getting the account.');
  }

  return accounts[0];
}

/**
 * Get the current chain ID.
 * @returns The current chain ID.
 */
export async function getChainId() {
  const chainId = await ethereum.request<string>({
    method: 'eth_chainId',
  });

  if (!chainId) {
    throw new Error('Something went wrong while getting the chain ID.');
  }

  return chainId;
}

/**
 * Get the attestations from the snap state.
 * @returns The attestations.
 */
export async function getAttestations() {
  const snapState = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: ManageStateOperation.GetState,
      encrypted: false,
    },
  });

  if (!snapState) {
    return [];
  }

  return snapState.attestations as Attestation[];
}

/**
 * Adds the attestations to the snap state.
 * @param attestations - The attestations to add.
 */
export async function setAttestations(attestations: Attestation[]) {
  try {
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: ManageStateOperation.UpdateState,
        newState: {
          attestations: attestations as any[],
        },
        encrypted: false,
      },
    });
  } catch (error) {
    console.error(`Failed to set attestations in the Snap's state`);
  }
}
