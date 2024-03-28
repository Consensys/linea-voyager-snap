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

import header from '../img/header.svg';
import { getState, truncateString } from './utils';

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

  return {
    content: panel([
      image(header),
      row(labelAddress, address(myAccount)),
      row(labelBalance, text(`${lxpBalance}`)),
      row(labelPohStatus, text(`${pohStatus}`)),
      ...activationsList,
      divider(),
      text(
        '_LXP earned in activations may not arrive in your wallet until the activation is complete._',
      ),
      text(
        `&bull; [View balance on Lineascan](https://lineascan.build/token/0xd83af4fbd77f3ab65c3b1dc4b38d7e67aecf599a?a=${myAccount})`,
      ),
      text('&bull; [Complete Proof of Humanity](https://poh.linea.build)'),
      text(
        '&bull; [Explore All Linea Activations](https://linea.build/activations)',
      ),
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
