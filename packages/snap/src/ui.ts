import type { DialogParams } from '@metamask/snaps-sdk';
import { heading, panel, text } from '@metamask/snaps-sdk';

import { getState } from './utils';

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

  const lxpCount = captions?.lxp.replace('{count}', `${lxpBalance}`);

  const pohStatus = `${captions?.poh.status as string} ${
    snapState?.myPohStatus
      ? `✅ ${captions?.poh.verified as string}`
      : `❌ ${captions?.poh.notVerified as string}`
  }`;

  const activationsToDisplay =
    activations?.length > 0
      ? captions?.activations.number.replace('{count}', `${activations.length}`)
      : captions?.activations.none;

  return {
    content: panel([
      heading(lxpCount as string),
      text(`[Lineascan](https://lineascan.build/address/${myAccount})`),
      heading(pohStatus),
      text('[POH page](https://poh.linea.build)'),
      heading(activationsToDisplay as string),
      text('[Activations page](https://linea.build/activations)'),
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
