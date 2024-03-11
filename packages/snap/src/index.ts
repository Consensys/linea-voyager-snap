import type {
  OnHomePageHandler,
  OnInstallHandler,
  OnRpcRequestHandler,
  OnUpdateHandler,
} from '@metamask/snaps-sdk';

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

  await setState({
    lxpAddress: lxpAddress?.toString() as string,
  });
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
      await setState({
        lxpAddress,
      });
      return lxpAddress;
    }

    case 'personalSign': {
      const { signature } = params;
      return registerAddress(signature);
    }

    default:
      throw new Error('Method not found.');
  }
};
