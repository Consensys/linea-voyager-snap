export const VERAX_API_BASE_URL = "";
export const VERAX_API_MY_ATTESTATIONS = "";

export interface Attestation {
  id?: string;
  content?: string;
  from?: string;
  to?: string;
  attestationDate?: number;
  expiryDate?: number;
}