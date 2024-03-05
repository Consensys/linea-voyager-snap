import type { OnHomePageHandler } from '@metamask/snaps-sdk';

import { getAttestationsForAddress } from './service';
import { showAttestationList } from './ui';
import { getAccount, getChainId, setAttestations } from './utils';

export const onHomePage: OnHomePageHandler = async () => {
  const myAccount = await getAccount();
  const chainId = await getChainId();

  const myAttestations = await getAttestationsForAddress(chainId, myAccount);
  await setAttestations(myAttestations);

  return showAttestationList();
};
