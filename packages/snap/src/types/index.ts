import type { Address } from '@metamask/snaps-sdk';

export type Captions = {
  locale: string;
  poh: {
    status: string;
    verified: string;
    notVerified: string;
  };
  lxp: string;
  balance: string;
  address: string;
  pohStatus: string;
  activations: {
    number: string;
    none: string;
    one: string;
  };
  lxpAddress: {
    heading: string;
    prompt: string;
  };
  nextSteps: {
    heading: string;
    body: string;
  };
  noAddress: {
    toSetText: string;
    toSetLink: string;
  };
  help: string;
  viewBalance: string;
  completePOH: string;
  exploreAll: string;
  errors: { 
    heading: string,
    invalidLxpAddress: string; 
  };
};

export type Tag = {
  sys: {
    id: string;
  };
};

export type Activation = {
  fields: {
    endDate: {
      'en-US': string;
    };
    tags: {
      'en-US': Tag[];
    };
    title: {
      'en-US': string;
    };
    url: {
      'en-US': string;
    };
  };
};

export type SnapState = {
  captions?: Captions;
  lxpAddress?: string;
  myLxpBalance?: number;
  myPohStatus?: boolean;
  activations?: Activation[];
};

export type Payload = {
  address: Address;
  signedOn: number;
  subject: string;
};
