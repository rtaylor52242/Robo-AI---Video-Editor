import { ProjectState, TrackType } from "./types";

export const INITIAL_PROJECT_STATE: ProjectState = {
  id: 'proj_001',
  name: 'New Project',
  currentTime: 0,
  totalDuration: 30,
  isPlaying: false,
  zoomLevel: 20, // 20 pixels per second
  selectedClipId: 'clip_1',
  tracks: [
    {
      id: 'track_1',
      name: 'Video Track 1',
      type: TrackType.VIDEO,
      isVisible: true,
      isLocked: false,
      clips: [
        {
          id: 'clip_1',
          trackId: 'track_1',
          name: 'Nature Footage',
          type: TrackType.VIDEO,
          startTime: 0,
          duration: 8,
          src: 'https://picsum.photos/id/10/800/450',
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          color: '#3b82f6' // blue-500
        },
        {
          id: 'clip_2',
          trackId: 'track_1',
          name: 'City Vibe',
          type: TrackType.VIDEO,
          startTime: 9,
          duration: 5,
          src: 'https://picsum.photos/id/12/800/450',
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          color: '#3b82f6'
        }
      ]
    },
    {
      id: 'track_2',
      name: 'Text Overlay',
      type: TrackType.TEXT,
      isVisible: true,
      isLocked: false,
      clips: [
        {
          id: 'clip_3',
          trackId: 'track_2',
          name: 'Title Card',
          type: TrackType.TEXT,
          startTime: 1,
          duration: 3,
          x: 0,
          y: 50,
          scale: 1.5,
          rotation: 0,
          opacity: 1,
          color: '#ec4899' // pink-500
        }
      ]
    },
    {
      id: 'track_3',
      name: 'Music',
      type: TrackType.AUDIO,
      isVisible: true,
      isLocked: false,
      clips: [
        {
          id: 'clip_4',
          trackId: 'track_3',
          name: 'LoFi Beat',
          type: TrackType.AUDIO,
          startTime: 0,
          duration: 15,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          volume: 0.8,
          color: '#10b981' // emerald-500
        }
      ]
    }
  ],
};