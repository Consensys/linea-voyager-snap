import { divider, heading, panel, row, text } from '@metamask/snaps-sdk';

import type { Attestation } from './types';
import { getAttestations } from './utils';

/**
 * Show the attestation list page.
 * @returns The attestation list page.
 */
export async function showAttestationList() {
  return {
    content: panel(await contentAttestationListPage()),
  };
}

/**
 * Show the content of the attestation list page.
 * @returns The content of the attestation list page.
 */
async function contentAttestationListPage() {
  const attestations = await getAttestations();

  const attestationItems = await Promise.all(
    attestations.map(async (attestation) =>
      contentAttestationDetail(attestation),
    ),
  );

  return [
    heading(`Your ${attestationItems.length} attestations`),
    ...attestationItems.flat(),
  ];
}

/**
 * Show the attestation details.
 * @param attestation - The attestation to show the details for.
 * @returns The attestation details.
 */
async function contentAttestationDetail(attestation: Attestation) {
  return [
    divider(),
    row('From', text(attestation.from)),
    row(
      'Attested On',
      text(new Date(attestation.attestationDate).toDateString()),
    ),
    row('Expiry', text(new Date(attestation.expiryDate).toDateString())),
    row('Content', text(attestation.content)),
  ];
}
