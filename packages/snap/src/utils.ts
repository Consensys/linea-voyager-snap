import { ManageStateOperation } from '@metamask/snaps-sdk';

import type { Captions, SnapState } from './types';

/**
 * Get the snap state.
 * @returns Snap State.
 */
export async function getState() {
  const snapState = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: ManageStateOperation.GetState,
      encrypted: false,
    },
  });
  return (snapState ?? {}) as SnapState;
}

/**
 * Set the snap state.
 * @param state - The new state to set.
 */
export async function setState(state: SnapState): Promise<void> {
  try {
    const currentState = await getState();
    const newState = {
      ...currentState,
      ...state,
    };
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: ManageStateOperation.UpdateState,
        newState,
        encrypted: false,
      },
    });
  } catch (error) {
    console.error(`Failed to set the Snap's state`);
  }
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
 * Convert the raw balance to a displayable balance.
 * @param rawBalance - The raw balance.
 * @returns The displayable balance.
 */
export function convertBalanceToDisplay(rawBalance?: string | null) {
  if (!rawBalance || rawBalance === '0x') {
    return 0;
  }

  return Number(BigInt(rawBalance) / BigInt(10 ** 18));
}

/**
 * Load the captions based on the locale and save to state.
 */
export async function loadCaptions() {
  const locale = await snap.request({ method: 'snap_getLocale' });
  let captions: Captions;
  try {
    captions = await import(`../locales/${locale}.json`);
  } catch (error) {
    console.error(
      `Cannot find localized files for lang '${locale}'. Switching to default 'en'`,
    );
    captions = await import(`../locales/en.json`);
  }
  await setState({
    captions,
  });
}
