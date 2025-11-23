export enum TrackType {
  VIDEO = 'video',
  AUDIO = 'audio',
  TEXT = 'text',
  EFFECT = 'effect'
}

export interface Clip {
  id: string;
  trackId: string;
  name: string;
  type: TrackType;
  startTime: number; // in seconds
  duration: number; // in seconds
  src?: string; // URL for media
  color?: string; // visual color for timeline
  
  // Transform properties
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  volume?: number;
}

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  clips: Clip[];
  isVisible: boolean;
  isLocked: boolean;
}

export interface ProjectState {
  id: string;
  name: string;
  currentTime: number; // in seconds
  totalDuration: number;
  isPlaying: boolean;
  zoomLevel: number; // pixels per second
  tracks: Track[];
  selectedClipId: string | null;
}

export enum TabOption {
  MEDIA = 'media',
  AUDIO = 'audio',
  TEXT = 'text',
  EFFECTS = 'effects',
  TRANSITIONS = 'transitions',
  AI_TOOLS = 'ai_tools'
}