import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Timeline from './components/Timeline';
import PropertiesPanel from './components/PropertiesPanel';
import { INITIAL_PROJECT_STATE } from './constants';
import { ProjectState, TrackType, Clip } from './types';

const App: React.FC = () => {
  const [project, setProject] = useState<ProjectState>(INITIAL_PROJECT_STATE);
  const playReqRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const togglePlay = useCallback(() => {
    setProject((prev) => {
      const isPlaying = !prev.isPlaying;
      if (isPlaying) {
         lastTimeRef.current = performance.now();
      }
      return { ...prev, isPlaying };
    });
  }, []);

  const onSeek = useCallback((time: number) => {
    setProject((prev) => ({ 
      ...prev, 
      currentTime: Math.min(Math.max(0, time), prev.totalDuration) 
    }));
  }, []);

  // Playback Loop
  useEffect(() => {
    const loop = (time: number) => {
      if (project.isPlaying) {
        const delta = (time - lastTimeRef.current) / 1000;
        lastTimeRef.current = time;

        setProject((prev) => {
          const nextTime = prev.currentTime + delta;
          if (nextTime >= prev.totalDuration) {
            return { ...prev, currentTime: 0, isPlaying: false };
          }
          return { ...prev, currentTime: nextTime };
        });

        playReqRef.current = requestAnimationFrame(loop);
      }
    };

    if (project.isPlaying) {
      playReqRef.current = requestAnimationFrame(loop);
    } else if (playReqRef.current) {
      cancelAnimationFrame(playReqRef.current);
    }

    return () => {
      if (playReqRef.current) cancelAnimationFrame(playReqRef.current);
    };
  }, [project.isPlaying, project.totalDuration]); // Dependency on isPlaying ensures loop starts/stops

  // Clip Management
  const handleUpdateClip = (id: string, updates: Partial<Clip>) => {
    setProject(prev => {
      const newTracks = prev.tracks.map(track => ({
        ...track,
        clips: track.clips.map(clip => 
          clip.id === id ? { ...clip, ...updates } : clip
        )
      }));
      return { ...prev, tracks: newTracks };
    });
  };

  const handleDeleteClip = (id: string) => {
    setProject(prev => {
      const newTracks = prev.tracks.map(track => ({
        ...track,
        clips: track.clips.filter(c => c.id !== id)
      }));
      return { ...prev, tracks: newTracks, selectedClipId: null };
    });
  };

  const handleAddClip = (type: 'video' | 'audio' | 'text', src?: string) => {
    setProject(prev => {
        const targetTrack = prev.tracks.find(t => 
            (type === 'video' && t.type === TrackType.VIDEO) ||
            (type === 'audio' && t.type === TrackType.AUDIO) ||
            (type === 'text' && t.type === TrackType.TEXT)
        );

        if (!targetTrack) return prev;

        const newClip: Clip = {
            id: `clip_${Date.now()}`,
            trackId: targetTrack.id,
            name: type === 'text' ? 'New Text' : 'New Clip',
            type: type === 'text' ? TrackType.TEXT : (type === 'audio' ? TrackType.AUDIO : TrackType.VIDEO),
            startTime: prev.currentTime,
            duration: 5,
            src: src,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 1,
            color: type === 'text' ? '#ec4899' : (type === 'audio' ? '#10b981' : '#3b82f6')
        };

        const newTracks = prev.tracks.map(t => 
            t.id === targetTrack.id ? { ...t, clips: [...t.clips, newClip] } : t
        );

        return { ...prev, tracks: newTracks, selectedClipId: newClip.id };
    });
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/30">
      <Header projectName={project.name} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Assets */}
        <div className="w-80 flex-shrink-0 z-10 shadow-xl">
           <Sidebar onAddClip={handleAddClip} />
        </div>
        
        {/* Center: Canvas */}
        <div className="flex-1 flex flex-col relative z-0">
          <Canvas project={project} />
        </div>

        {/* Right: Properties */}
        <div className="flex-shrink-0 z-10 shadow-xl">
          <PropertiesPanel 
             project={project} 
             updateClip={handleUpdateClip}
             deleteClip={handleDeleteClip}
          />
        </div>
      </div>

      {/* Bottom: Timeline */}
      <div className="flex-shrink-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]">
        <Timeline 
          project={project} 
          setProject={setProject} 
          onSeek={onSeek}
          togglePlay={togglePlay}
        />
      </div>
    </div>
  );
};

export default App;