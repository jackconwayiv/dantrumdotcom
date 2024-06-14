export type DjangoPaginatedResponse<T> = {
  count: number;
  next: string;
  previous: string;
  results: T[];
};
interface SocialAuth {
  picture: "string";
}

export interface Album {
  id?: number;
  title: string;
  description?: string;
  link_url: string;
  thumbnail_url?: string;
  date: string;
  owner?: string;
}

export interface Quote {
  id?: number;
  text: string;
  date: string;
  date_created?: string;
  date_updated?: string;
  owner?: string;
}

export interface Resource {
  id?: number;
  title: string;
  description?: string;
  url: string;
  thumbnail_url?: string;
  owner?: string;
}

export interface Friend {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  social_auth: SocialAuth[];
  date_of_birth: string;
}

export interface User {
  first_name: string;
  last_name: string;
  username: string;
  email?: string;
  social_auth?: SocialAuth[];
  date_of_birth: string;
  last_login?: string;
  date_joined?: string;
  // is_active: boolean;
  // albums: Album[];
  // quotes: Quote[];
}
