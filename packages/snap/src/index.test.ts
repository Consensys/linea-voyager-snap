import { expect, describe, it } from '@jest/globals';
import { installSnap } from '@metamask/snaps-jest';
import { panel, heading, text } from '@metamask/snaps-sdk';

describe('onHomePage', () => {
  it('returns custom UI', async () => {
    const { onHomePage } = await installSnap();

    const response = await onHomePage();
    expect(response).toRender(
      panel([
        heading('You have 0 LXP'),
        text('[Lineascan](https://lineascan.build/address/undefined)'),
        heading('Your POH status: ❌ Not verified'),
        text('[POH page](https://poh.linea.build)'),
        heading('There are no current activations'),
        text('[Activations page](https://linea.build/activations)'),
      ]),
    );
  });
});
