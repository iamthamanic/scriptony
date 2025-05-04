
export interface ColorReference {
  id: string;
  name: string;
  hexCode: string;
}

export interface AudioReference {
  id: string;
  name: string;
  url?: string;
  file?: string;
  isExternal: boolean;
}

export interface VisualReference {
  id: string;
  name: string;
  url: string;
}
