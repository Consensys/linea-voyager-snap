import {
  button,
  divider,
  heading,
  panel,
  row,
  text,
} from '@metamask/snaps-sdk';
import { Attestation } from './vars';
import { getAttestations, getSelectedAttestation } from './utils';

export async function showForm_AttestationList() {
  return {
    content: panel(await contentAttestationListPage()),
  };
}

export async function showForm_AttestationListRedraw(id: string) {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: panel(await await contentAttestationListPage()),
    },
  });
}

export async function showForm_AttestationDetail(id: string, attestationId: string) {
  const attestation = await getSelectedAttestation(attestationId) as Attestation;

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: panel(await contentAttestationDetailPage(id, attestationId)),
    },
  });
}

async function contentAttestationListPage() {
  const attestations = await getAttestations()
  const attaestationItems = attestations.map(a => (
    button({
      name: a.id as string,
      value: a.from as string,
      buttonType: 'button',
      variant: 'secondary',
    })
  ));
  return [
    heading('Your Attestations'),
    divider(),
    ...attaestationItems
  ]
}

async function contentAttestationDetailPage(id: string, attestationId: string) {
  const attestation = await getSelectedAttestation(attestationId) as Attestation;
  return [
    heading("Attestation Detail"),
    divider(),
    row("From", text(attestation.from)),
    row("Attested On", text(new Date(attestation.attestationDate as number).toDateString())),
    row("Expiry", text(new Date(attestation.expiryDate as number).toDateString())),
    row("Attestation", text("")),
    text(attestation.content),
    button({
      name: "btnBack",
      value: "< Back",
      buttonType: 'button',
      variant: 'secondary'
    }),
  ]
}
