import type { OnHomePageHandler, OnInstallHandler } from '@metamask/snaps-sdk';

import { getLxpBalanceForAddress, getPohStatus } from './service';
import type { Activation } from './types';
import { renderMainUi, renderPromptLxpAddress } from './ui';
import { getChainId, getState, loadCaptions, setState } from './utils';

export const onInstall: OnInstallHandler = async () => {
  await loadCaptions();
  const lxpAddress = await snap.request({
    method: 'snap_dialog',
    params: await renderPromptLxpAddress(),
  });

  await setState({
    lxpAddress: lxpAddress?.toString() as string,
  });
};

export const onHomePage: OnHomePageHandler = async () => {
  await loadCaptions();
  const chainId = await getChainId();
  const snapState = await getState();
  const myAccount = snapState.lxpAddress as string;
  const myLxpBalance = await getLxpBalanceForAddress(myAccount, chainId);
  const myPohStatus = await getPohStatus(myAccount);
  const activations = [] as Activation[]; // await getCurrentActivations();

  await setState({
    myLxpBalance,
    myPohStatus,
    activations,
  });

  return renderMainUi(myAccount);
};
