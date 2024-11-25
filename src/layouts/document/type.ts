export type DocumentContextType = {
  document: DocumentType;
  fetchDocument: (id: string) => void;
  clearDocument: () => void;
  saveDocument: () => void;
  loading: boolean;
};

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type DocumentType = {
  id: string;
  document_name: string;
  project_id: string;
  project_path: string[];
  template_id?: string;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  current_version: Omit<DocumentVersionType, "version_name">;
  metadata?: {
    thumbnail_url?: string;
  };
} | null;

export type DocumentStateType = {
  status?: string;
  loading: boolean;
  document: DocumentType;
};

export type DocumentVersionType = {
  version_id: string;
  created_at: Date;
  created_by: string;
  content: string;
  version_name: string;
  is_auto_saved?: boolean;
};
