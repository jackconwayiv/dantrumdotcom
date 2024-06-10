interface SocialAuthType {
  picture: "string";
}

export interface AlbumType {
  id: number;
  title: string;
  description: string;
  link_url: string;
  thumbnail_url: string;
  date: string;
  owner: number;
}

export interface QuoteType {
  id: number;
  text: string;
  date: string;
  date_created: string;
  date_updated: string;
  owner: number;
}

export interface UserType {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  social_auth: SocialAuthType;
  date_of_birth: string;
  last_login: string;
  date_joined: string;
  is_active: boolean;
  albums: AlbumType[];
  quotes: QuoteType[];
}
