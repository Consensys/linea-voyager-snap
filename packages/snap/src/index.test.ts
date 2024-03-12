import { describe, expect, it } from '@jest/globals';
import { installSnap } from '@metamask/snaps-jest';

describe('onHomePage', () => {
  it('renders a UI', async () => {
    const { onHomePage } = await installSnap();

    const response = await onHomePage();
    expect(response).not.toBeNull();
  });
});
