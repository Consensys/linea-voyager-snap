import { expect, describe, it } from '@jest/globals';
import { installSnap } from '@metamask/snaps-jest';
import { panel, heading } from '@metamask/snaps-sdk';

describe('onHomePage', () => {
  it('returns custom UI', async () => {
    const { onHomePage } = await installSnap();

    const response = await onHomePage();
    expect(response).toRender(
      panel([heading('You do not have any attestations.')]),
    );
  });
});
