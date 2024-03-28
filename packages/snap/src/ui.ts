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

import { getState, truncateString } from './utils';

import header from '../img/header.svg'; 

/**
 * Render the main UI.
 * @param myAccount - The account to render the UI for.
 * @returns The main UI.
 */
export async function renderMainUi(myAccount: string) {
  const snapState = await getState();
  const lxpBalance = snapState?.myLxpBalance ?? 0;
  const activations = snapState?.activations ?? [];
  const captions = snapState?.captions;

  const labelBalance = captions?.balance;
  const labelAddress = captions?.address;
  const labelPohStatus = captions?.pohStatus;

  const pohStatus = `${
    snapState?.myPohStatus
      ? `✅ ${captions?.poh.verified as string}`
      : `❌ ${captions?.poh.notVerified as string}`
  }`;

  const activationsList = [];

  if (activations?.length > 0) {
    activationsList.push(divider());
    const activationsCount =
      activations.length === 1
        ? captions?.activations.one.replace('{count}', `${activations.length}`)
        : captions?.activations.number.replace(
            '{count}',
            `${activations.length}`,
          );
    activationsList.push(text(`**${activationsCount as string}**`));
    for (const a of activations) {
      activationsList.push(
        text(
          `&bull; [${truncateString(a.fields.title['en-US'], 30)}](${
            a.fields.url['en-US']
          })`,
        ),
      );
    }
  }

  const myData = [];

  if (myAccount) {
    myData.push(row(labelAddress, address(myAccount)));
    myData.push(row(labelBalance, text(`${lxpBalance}`)));
    myData.push(row(labelPohStatus, text(`${pohStatus}`)));
  } else {
    const addressToSetText = captions?.noAddress?.toSetText as string;
    const addressToSetLink = captions?.noAddress?.toSetLink as string;
    myData.push(
      text(
        `${addressToSetText} [${addressToSetLink}](https://lxp-snap.linea.build).`,
      ),
    );
  }

  const help = captions?.help as string;
  const viewBalance = captions?.viewBalance as string;
  const completePOH = captions?.completePOH as string;
  const exploreAll = captions?.exploreAll as string;

  return {
    content: panel([
      image(header),
      ...myData,
      ...activationsList,
      divider(),
      text(`_${help}_`),
      text(
        `&bull; [${viewBalance}](https://lineascan.build/token/0xd83af4fbd77f3ab65c3b1dc4b38d7e67aecf599a?a=${myAccount})`,
      ),
      text(`&bull; [${completePOH}](https://poh.linea.build)`),
      text(`&bull; [${exploreAll}](https://linea.build/activations)'`),
    ]),
  };
}

/**
 * Render the UI in the onInstall hook.
 * @returns DialogParams UI for onInstall.
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
