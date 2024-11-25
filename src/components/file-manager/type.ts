export type DocumentItemType = {
  id: string;
  document_name: string;
  project_id: string;
  project_path: string[];
  template_id?: string;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  metadata?: {
    thumbnail_url?: string;
  };
};

export type FolderItemType = {
  id: string;
  title: string;
  created_by: string;
  project_path: string[];
  updated_at: Date;
  updated_by: string;
  sub_projects?: FolderItemType[];
  documents?: DocumentItemType[];
};

export type ManagerItemType = {
  id: string;
  title: string;
  type: "document" | "folder";
  updated_at: Date;
};
