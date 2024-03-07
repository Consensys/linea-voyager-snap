export type Captions = {
  locale: string;
  noAttestations: string;
  poh: {
    status: string;
    verified: string;
    notVerified: string;
  };
  lxp: string;
  activations: {
    number: string;
    none: string;
  };
};

export type Tag = {
  name: string;
};

export type Activation = {
  title: string;
  url: string;
  endDate: string;
  tags: Tag[];
};

export type SnapState = {
  captions: Captions;
  myLxpBalance?: number;
  myPohStatus?: boolean;
  activations?: Activation[];
};
