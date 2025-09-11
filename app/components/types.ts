export type Party = {
  name: string;
  email: string[];
  address: string[];
};

export type CoverData = {
  title: string;
  from: Party;
  to: Party;
  labels: {
    clientAddress: string;
    sent?: string;
    accepted?: string;
  };
};

// Update function helpers for components that need to mutate CoverData
export type UpdateCoverRoot = <K extends keyof CoverData>(
  key: K,
  value: CoverData[K]
) => void;
export type UpdateParty = <K extends keyof Party>(
  key: K,
  value: Party[K]
) => void;

// Header style and theming types used across the app
export type HeaderStyleData = {
  themeName: string;
  backgroundImage: string | null;
  titleColor: string;
  textColor: string;
  backgroundColor: string;
  bottomBorderColor: string;
  bottomBorderWidth: number; // px
};

export type HeaderData = {
  companyLogo?: string;
  invoiceName: string;
  sentDate: string;
  acceptedDate: string;
  from: Party;
  to: Party;
};
