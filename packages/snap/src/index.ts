import type { OnHomePageHandler } from '@metamask/snaps-sdk';

import {
  getCurrentActivations,
  getLxpBalanceForAddress,
  getPohStatus,
} from './service';
import { renderMainUi } from './ui';
import { getAccount, getChainId, setState } from './utils';

export const onHomePage: OnHomePageHandler = async () => {
  const locale = await snap.request({ method: 'snap_getLocale' });
  let captions;
  try {
    captions = await import(`../locales/${locale}.json`);
  } catch (error) {
    console.error(
      `Cannot find localized files for lang '${locale}'. Switching to default 'en'`,
    );
    captions = await import(`../locales/en.json`);
  }

  const chainId = await getChainId();

  const myAccount = await getAccount();
  const myLxpBalance = await getLxpBalanceForAddress(myAccount, chainId);
  const myPohStatus = await getPohStatus(myAccount);
  const activations = await getCurrentActivations();

  await setState({
    captions,
    myLxpBalance,
    myPohStatus,
    activations,
  });

  return renderMainUi(myAccount);
};
