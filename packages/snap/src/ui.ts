import type { DialogParams } from '@metamask/snaps-sdk';
import {
  address,
  divider,
  heading,
  image,
  panel,
  row,
  text,
} from '@metamask/snaps-sdk';

import banner from '../img/banner.svg';
import { getState, LXP_CONTRACT_ADDRESS, truncateString } from './utils';

/**
 * Render the main UI.
 * @param myAccount - The account to render the UI for.
 * @returns The main UI.
 */
export async function renderMainUi(myAccount: string) {
  const snapState = await getState();
  const lxpBalance = snapState?.myLxpBalance ?? 0;
  const openBlockScore = snapState?.myOpenBlockScore ?? 0;
  const name = snapState?.myLineaEns ?? '';

  const captions = snapState?.captions;

  const labelBalance = captions?.balance;
  const labelBalanceLxpL = captions?.balanceLxpL;
  const labelAddress = captions?.address;
  const labelPohStatus = captions?.pohStatus;
  const labelLineaEns = captions?.lineaEns;

  const pohStatus = `${
    snapState?.myPohStatus
      ? `✅ ${captions?.poh.verified as string}`
      : `❌ ${captions?.poh.notVerified as string}`
  }`;

  const myData = [];

  if (myAccount) {
    myData.push(row(labelAddress, address(myAccount as `0x${string}`)));
    myData.push(row(labelBalance, text(`${lxpBalance}`)));
    myData.push(row(labelBalanceLxpL, text(`${openBlockScore}`)));
    myData.push(row(labelPohStatus, text(`${pohStatus}`)));
  } else {
    const addressToSetText = captions?.noAddress?.toSetText as string;
    const addressToSetLink = captions?.noAddress?.toSetLink as string;
    myData.push(
      text(
        `${addressToSetText} [${addressToSetLink}](https://voyager-snap.linea.build).`,
      ),
    );
  }

  if (name && name !== '') {
    myData.push(row(labelLineaEns, text(name)));
  }

  const viewBalance = captions?.viewBalance as string;
  const viewLxpLBalance = captions?.viewLxpLBalance as string;
  const completePOH = captions?.completePOH as string;
  const exploreAll = captions?.exploreAll as string;
  const manageLineaEns = captions?.manageLineaEns as string;
  const getLineaEns = captions?.getLineaEns as string;

  const extraLinks = [];
  extraLinks.push(
    text(
      `&bull; [${viewBalance}](https://lineascan.build/token/${LXP_CONTRACT_ADDRESS}?a=${myAccount})`,
    ),
  );

  extraLinks.push(
    text(
      `&bull; [${viewLxpLBalance}](https://app.openblocklabs.com/app/linea/dashboard)`,
    ),
  );

  extraLinks.push(
    text(
      `&bull; [${
        name && name !== '' ? manageLineaEns : getLineaEns
      }](https://names.linea.build/)`,
    ),
  );

  if (!snapState?.myPohStatus) {
    extraLinks.push(text(`&bull; [${completePOH}](https://poh.linea.build)`));
  }
  extraLinks.push(
    text(`&bull; [${exploreAll}](https://linea.build/ecosystem)`),
  );

  return {
    content: panel([
      image(banner),
      ...myData,
      divider(),
      ...extraLinks,
    ]),
  };
}

/**
 * Render the UI in the onRpcRequest for setting a watch address.
 * @returns DialogParams UI for onRpcRequest dialog.
 */
export async function renderPromptLxpAddress() {
  const snapState = await getState();
  const captions = snapState?.captions;

  return {
    type: 'prompt',
    content: panel([
      heading(captions?.lxpAddress.heading as string),
      text(captions?.lxpAddress.prompt),
    ]),
    placeholder: '0x123...',
  } as DialogParams;
}

/**
 * Render the UI in the onInstall hook.
 * @returns DialogParams UI for onInstall.
 */
export async function renderPromptNextSteps() {
  const snapState = await getState();
  const captions = snapState?.captions;

  return {
    type: 'alert',
    content: panel([
      heading(captions?.nextSteps.heading as string),
      text(captions?.nextSteps.body as string),
    ]),
  } as DialogParams;
}

/**
 * Render the UI in the onRpcRequest for setting a watch address when an invalid address is provided.
 * @param lxpAddressStr - The LXP Address.
 * @returns DialogParams UI for onRpcRequest error dialog.
 */
export async function renderPromptLxpAddressError(lxpAddressStr: string) {
  const snapState = await getState();
  const captions = snapState?.captions;

  const errorMsg = captions?.errors.invalidLxpAddress.replace(
    '{address}',
    lxpAddressStr,
  );

  return {
    type: 'alert',
    content: panel([
      heading(captions?.errors.heading as string),
      text(errorMsg),
    ]),
  } as DialogParams;
}
