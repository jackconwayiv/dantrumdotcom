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
  owner?: User;
}

export interface Quote {
  id?: number;
  text: string;
  date: string;
  date_created?: string;
  date_updated?: string;
  owner?: User;
}

export interface Resource {
  id?: number;
  title: string;
  description?: string;
  url: string;
  thumbnail_url?: string;
  owner?: User;
}

export interface Friend {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  social_auth: SocialAuth[];
  date_of_birth: string;
  is_active: boolean;
  last_login?: string;
}

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  username: string;
  email?: string;
  social_auth?: SocialAuth[];
  date_of_birth: string;
  last_login?: string;
  date_joined?: string;
  is_staff?: boolean;
  // is_active: boolean;
  // albums: Album[];
  // quotes: Quote[];
}

export interface FamilyTreeMember {
  id: number;
  name: string;
  title?: string;
  date_of_birth?: string;
  date_of_death?: string;
  owner: number;
}

export interface FamilyTreeRelation {
  id: number;
  from_member: FamilyTreeMember;
  to_member: FamilyTreeMember;
  type: "vertical" | "horizontal";
  owner: number;
}

export interface AddMemberData {
  name: string;
  title?: string;
  date_of_birth?: string | null;
  date_of_death?: string | null;
  relation_type: string;
  related_member_id: number;
}
