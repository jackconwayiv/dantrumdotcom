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
  timeline_excluded?: boolean;
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

export type HomeRecentKind = "album" | "resource" | "event" | "birthday";

export interface HomeRecentResponse {
  items: HomeRecentItem[];
  counts: {
    event: number;
    birthday: number;
    album: number;
    resource: number;
  };
}

export interface HomeRecentItem {
  kind: HomeRecentKind;
  id: number;
  title: string;
  description?: string;
  link_url: string;
  thumbnail_url?: string;
  sort_date: string;
  owner?: User;
  date?: string;
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

export type TimelineEventType = "album" | "event" | "birthday";

export interface TimelineMonthEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  date: string | null;
  sort_date: string;
  owner: User;
  link_url: string | null;
  description: string | null;
  can_remove_from_timeline: boolean;
}

export interface TimelineYearSummary {
  year: number;
  months_with_events: number[];
}

export interface TimelineSummary {
  years: TimelineYearSummary[];
}

export interface TimelineMonthDetail {
  year: number;
  month: number;
  month_name: string;
  events: TimelineMonthEvent[];
}

export interface TimelineCustomEvent {
  id?: number;
  title: string;
  date: string;
  description?: string;
  owner?: User;
}

export interface AddMemberData {
  name: string;
  title?: string;
  date_of_birth?: string | null;
  date_of_death?: string | null;
  relation_type: string;
  related_member_id: number;
}
