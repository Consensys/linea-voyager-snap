export type Captions = {
  locale: string;
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
  lxpAddress: {
    heading: string;
    prompt: string;
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
  captions?: Captions;
  lxpAddress?: string;
  myLxpBalance?: number;
  myPohStatus?: boolean;
  activations?: Activation[];
};
