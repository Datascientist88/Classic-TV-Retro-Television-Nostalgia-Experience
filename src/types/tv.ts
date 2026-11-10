export type TVEra = '1950s' | '1970s' | '1980s' | '1990s';

export type VideoSource = 'youtube' | 'archive_org' | 'direct';

export type ScreenFilter = 'color' | 'bw' | 'amber' | 'green';

export type ChannelCategory =
  | 'Black & White Classics'
  | '1950s–1960s Television'
  | '1970s Classics'
  | '1980s Television'
  | 'Classic Hollywood Movies'
  | 'Vintage Cartoons'
  | 'Old Commercials'
  | 'Classic Music & Concerts'
  | 'Historical Documentaries'
  | 'Retro Radio & Audio';

export type GenreType =
  | 'Cartoons'
  | 'Comedy'
  | 'Commercials'
  | 'Drama'
  | 'Gameshows'
  | 'Movies'
  | 'Music'
  | 'News'
  | 'Documentary'
  | 'Sci-Fi';

export interface TVProgram {
  id: string;
  title: string;
  channelNumber: number;
  channelName: string;
  decade: '1950s' | '1960s' | '1970s' | '1980s' | '1990s';
  year: number;
  genre: GenreType;
  category: ChannelCategory;
  source: VideoSource;
  videoId: string; // YouTube video ID or archive.org identifier / direct stream url
  thumbnail?: string;
  description: string;
  duration?: string;
  isPublicDomain?: boolean;
  licenseInfo?: string;
  featured?: boolean;
}

export interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  era: '1940s' | '1950s' | '1960s' | '1970s' | '1980s';
  genre: string;
  description: string;
  streamUrl: string;
  trackList?: string[];
}

export interface TVSettings {
  isPoweredOn: boolean;
  era: TVEra;
  volume: number; // 0 to 100
  isMuted: boolean;
  filter: ScreenFilter;
  curvature: boolean;
  scanlines: boolean;
  staticBurstOnSwitch: boolean;
  hissVolume: number; // 0 to 100
  currentChannelNumber: number;
  activeGenreFilters: GenreType[];
  selectedYear: number | null; // e.g. 1984
  channelSurfing: boolean;
}
