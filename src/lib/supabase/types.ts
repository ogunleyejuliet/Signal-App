export interface Profile {
  user_id: string;
  name: string;
  profession: string;
  location: string;
  specialization: string;
  services: string;
  target_clients: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileLink {
  id: string;
  user_id: string;
  type: 'website' | 'linkedin' | 'portfolio';
  url: string;
  created_at: string;
}

export interface ProfileWithLinks extends Profile {
  links: ProfileLink[];
}