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
  };
  lxpAddress: {
    heading: string;
    prompt: string;
  };
};

export type Tag = {
  sys: {
    id: string;
  };
};

export type Activation = {
  title: string;
  url: string;
  fields: {
    endDate: {
      'en-US': string;
    };
    tags: {
      'en-US': Tag[];
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
