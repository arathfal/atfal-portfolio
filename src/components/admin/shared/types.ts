export type Feedback = {
  type: "success" | "error";
  text: string;
};

export type UploadSignature = {
  cloudName: string;
  apiKey: string;
  signature: string;
  timestamp: number;
  folder: string;
  upload_preset: string;
};
