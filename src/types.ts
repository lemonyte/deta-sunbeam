export type Instance = {
  id: string;
  app_id: string;
  release: {
    app_name: string;
    channel: "experimental" | "development";
    icon_url?: string;
    short_description?: string;
    id: string;
  };
  url: string;
};

export type CanvasItem = {
  id: string;
  index_number: number;
  item_id: string;
  item_type: "discovery" | "system_app";
  data: null;
};

export type BuildStatus = "complete" | "pending" | "internal-error" | "failed" | "timed-out" | "running";

export type Build = {
  id: string;
  tag: string;
  app_id: string;
  status: BuildStatus;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Revision = {
  id: string;
  tag: string;
  app_id: string;
  app_name: string;
  created_at: string;
  updated_at: string;
};

export type Release = {
  id: string;
  name: string;
  short_description: string;
  release_alias: string;
  app_name: string;
  app_id: string;
  version: string;
  icon_url?: string;
  status: string;
  latest: boolean;
  released_at: string;
  discovery: {
    title?: string;
    tagline: string;
    theme_color: string;
    git?: string;
    homepage?: string;
    canonical_url: string;
    listed_url: string;
    stats: {
      total_installs: number;
      release_installs: string;
    };
    listed: boolean;
  };
};

export type Collection = {
  id: string;
  name: string;
  created_at: string;
  migrated?: boolean;
};

export type Base = {
  name: string;
  collection_id: string;
  status: string;
};

export type Drive = {
  name: string;
  collection_id: string;
  status: string;
};

export type CreateKeyResponse = {
  name: string;
  created_at: string;
  value: string;
};

export type SearchResponse = {
  hits: SearchHit[];
  query: string;
};

export type SearchResult = {
  id: string;
  title: string;
  parts: string[];
  section: string;
  url: string;
};

export type SearchSection = {
  title: string;
  results: SearchResult[];
};

export type SearchHit = {
  objectID: string;

  hierarchy_lvl0: string;
  hierarchy_lvl1: string;
  hierarchy_lvl2: string;
  hierarchy_lvl3: string;
  hierarchy_lvl4: string;
  hierarchy_lvl5: string;
  hierarchy_lvl6: string;

  anchor: string;
  url: string;
};
