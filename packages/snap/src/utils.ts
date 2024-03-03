import { ManageStateOperation } from "@metamask/snaps-sdk";
import { Attestation } from "./vars";

export async function getMyAttestations(address: string) {
  //  Retreive data uisng API, from Linea for attestations for `address`
  const plusOneYearMs = 2 * 365 * 24 * 60 * 60 * 60;
  const attestations = [
    {
      id: "1",
      from: "University of Florida",
      to: "0x1",
      attestationDate: Date.now(),
      expiryDate: Date.now() + plusOneYearMs,
      content: "You have a Bachelors Degree"
    },
    {
      id: "2",
      from: "Dept. of Motor Vehicles",
      to: "0x2",
      attestationDate: Date.now(),
      expiryDate: Date.now() + plusOneYearMs,
      content: "You can Drive"
    },
    {
      id: "3",
      from: "Ethereum Foundation",
      to: "0x3",
      attestationDate: Date.now(),
      expiryDate: Date.now() + plusOneYearMs,
      content: "You are a solidity Engineer"
    },
    {
      id: "4",
      from: "Gitcoin Passport",
      to: "0x4",
      attestationDate: Date.now(),
      expiryDate: Date.now() + plusOneYearMs,
      content: "You are a Human"
    },
  ] as Attestation[];
  console.log("attestations", attestations);
  return attestations;
}

export async function getAccount() {
  const accounts = await ethereum.request<string[]>({
    method: 'eth_requestAccounts',
  });

  return (accounts as string[])[0] as string;
}

export async function getSelectedAttestation(id: string) {
  const snapState = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: ManageStateOperation.GetState,
      encrypted: false,
    },
  });
  const attestations = snapState?.attestations as Attestation[];
  return attestations.find(a => a.id == id);
}

export async function getAttestations() {
  const snapState = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: ManageStateOperation.GetState,
      encrypted: false,
    },
  });
  const attestations = snapState?.attestations as Attestation[];
  return attestations;
}

export async function setAttestations(attestations: Attestation[]) {
  try {
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: ManageStateOperation.UpdateState,
        newState: {
          attestations: attestations as any[]
        },
        encrypted: false,
      },
    });
  }
  catch (err) { }
}
