export type CreateAssetFields = {
  title: string;
  description?: string;
  file: {
    fileName: string;
    contentType: string;
    upload?: string;
  };
};

export type AssetFields = {
  title: string;
  description: string;
  file: {
    url: string;
    details: {
      size: number;
      image?: {
        width: number;
        height: number;
      };
    };
    fileName: string;
    contentType: string;
  };
};
