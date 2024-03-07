import { heading, panel, text } from '@metamask/snaps-sdk';

import { getState } from './utils';

/**
 * Render the main UI.
 * @param myAccount - The account to render the UI for.
 * @returns The main UI.
 */
export async function renderMainUi(myAccount: string) {
  const snapState = await getState();
  const attestations = snapState?.myAttestations ?? [];
  const lxpBalance = snapState?.myLxpBalance ?? 0;
  const activations = snapState?.activations ?? [];
  const captions = snapState?.captions;

  const lxpCount =
    attestations.length > 0
      ? captions.lxp.replace('{count}', `${lxpBalance}`)
      : captions.noAttestations;

  const pohStatus = `${captions?.poh.status} ${
    snapState?.myPohStatus
      ? `✅ ${captions.poh.verified}`
      : `❌ ${captions.poh.notVerified}`
  }`;

  const activationsToDisplay =
    activations?.length > 0
      ? captions.activations.number.replace('{count}', `${activations.length}`)
      : captions.activations.none;

  return {
    content: panel([
      heading(lxpCount),
      text(`[Lineascan](https://lineascan.build/address/${myAccount})`),
      heading(pohStatus),
      text('[POH page](https://poh.linea.build)'),
      heading(activationsToDisplay),
      text('[Activations page](https://linea.build/activations)'),
    ]),
  };
}
