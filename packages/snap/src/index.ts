import type {
  OnHomePageHandler,
  OnInstallHandler,
  OnRpcRequestHandler,
  OnUpdateHandler,
} from '@metamask/snaps-sdk';
import { isValidHexAddress } from '@metamask/utils';

import {
  getCurrentActivations,
  getLxpBalanceForAddress,
  getPohStatus,
  registerAddress,
} from './service';
import { renderMainUi, renderPromptLxpAddress } from './ui';
import { getChainId, getState, loadCaptions, setState } from './utils';

export const onInstall: OnInstallHandler = async () => {
  await loadCaptions(true);
  const lxpAddress = await snap.request({
    method: 'snap_dialog',
    params: await renderPromptLxpAddress(),
  });

  if (lxpAddress) {
    const lxpAddressStr = lxpAddress as `0x${string}`;
    if (isValidHexAddress(lxpAddressStr)) {
      await setState({
        lxpAddress: lxpAddressStr,
      });
    } else {
      console.error(`${lxpAddress} is not a valid address`);
    }
  }
};

export const onUpdate: OnUpdateHandler = async () => {
  await loadCaptions(true);
};

export const onHomePage: OnHomePageHandler = async () => {
  await loadCaptions(true);
  const chainId = await getChainId();
  const snapState = await getState();
  const myAccount = snapState.lxpAddress as string;
  const myLxpBalance = await getLxpBalanceForAddress(myAccount, chainId);
  const myPohStatus = await getPohStatus(myAccount);
  const activations = await getCurrentActivations();

  await setState({
    myLxpBalance,
    myPohStatus,
    activations,
  });

  return renderMainUi(myAccount);
};

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  const params = request.params as any;

  switch (request.method) {
    case 'getLxpAddress': {
      const snapState = await getState();
      return snapState.lxpAddress as string;
    }

    case 'setLxpAddress': {
      const { lxpAddress } = params;

      if (lxpAddress) {
        const lxpAddressStr = lxpAddress as `0x${string}`;
        if (isValidHexAddress(lxpAddressStr)) {
          await setState({
            lxpAddress: lxpAddressStr,
          });
          return lxpAddress;
        }
        console.error(`${lxpAddress} is not a valid address`);
        return null;
      }
      console.error(`No address provided.`);
      return null;
    }

    case 'personalSign': {
      const { signature, payload } = params;
      return registerAddress(signature, payload);
    }

    default:
      throw new Error('Method not found.');
  }
};
