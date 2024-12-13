export type SnippetConfig = {
  name: string;
  description?: string;
  version: string;
  author?: string;
  contributors?: string[];
  license?: string;
  fullLicense?: string;
  homepage?: string;
  repository?: string;
  dependencies?: {
    [key: string]: string;
  };
  extends?: string;
  compatibleVersions?: string;
  file: string;
  content?: string;
};
