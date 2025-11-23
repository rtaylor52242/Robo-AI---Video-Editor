import React, { useRef, useEffect } from 'react';
import { ProjectState, TrackType } from '../types';
import { Icons } from './Icon';

interface TimelineProps {
  project: ProjectState;
  setProject: React.Dispatch<React.SetStateAction<ProjectState>>;
  onSeek: (time: number) => void;
  togglePlay: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ project, setProject, onSeek, togglePlay }) => {
  const rulerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const PIXELS_PER_SECOND = project.zoomLevel;
  const RULER_STEP = 5; // Major tick every 5 seconds

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Basic seek implementation
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + containerRef.current.scrollLeft - 256; // 256 is sidebar width roughly
    const time = Math.max(0, x / PIXELS_PER_SECOND);
    onSeek(time);
  };

  const handleClipClick = (e: React.MouseEvent, clipId: string) => {
    e.stopPropagation();
    setProject(prev => ({ ...prev, selectedClipId: clipId }));
  };

  // Generate ticks
  const ticks = [];
  for (let i = 0; i <= project.totalDuration; i += 1) {
    ticks.push(i);
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-72 bg-zinc-950 flex flex-col border-t border-zinc-800">
      {/* Timeline Toolbar */}
      <div className="h-10 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900">
        <div className="flex items-center gap-4">
           <button className="text-zinc-400 hover:text-white" title="Undo"><Icons.Undo2 size={16} /></button>
           <button className="text-zinc-400 hover:text-white" title="Redo"><Icons.Redo2 size={16} /></button>
           <div className="h-4 w-[1px] bg-zinc-700"></div>
           <button className="text-zinc-400 hover:text-white" title="Split"><Icons.Scissors size={16} /></button>
           <button className="text-zinc-400 hover:text-white" title="Delete"><Icons.Trash2 size={16} /></button>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center transition-colors">
              {project.isPlaying ? <Icons.Pause size={14} fill="white" /> : <Icons.Play size={14} fill="white" className="ml-0.5" />}
           </button>
        </div>
        <div className="w-20"></div> {/* Spacer */}
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Track Headers (Left Sidebar) */}
        <div className="w-32 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 z-20 shadow-lg">
           <div className="h-8 border-b border-zinc-800 bg-zinc-950"></div> {/* Ruler spacer */}
           <div className="flex flex-col">
              {project.tracks.map(track => (
                <div key={track.id} className="h-20 border-b border-zinc-800 flex items-center px-3 gap-2 group">
                   <div className="text-zinc-500">
                      {track.type === TrackType.VIDEO && <Icons.Layers size={14} />}
                      {track.type === TrackType.AUDIO && <Icons.Music size={14} />}
                      {track.type === TrackType.TEXT && <Icons.Type size={14} />}
                   </div>
                   <span className="text-xs text-zinc-400 font-medium truncate w-16">{track.name}</span>
                   <div className="ml-auto opacity-0 group-hover:opacity-100 flex gap-1">
                      <Icons.Volume2 size={12} className="text-zinc-500 cursor-pointer hover:text-white" />
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Tracks Area */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar relative"
          onClick={handleTimelineClick}
        >
           {/* Ruler */}
           <div 
              className="h-8 bg-zinc-950 border-b border-zinc-800 sticky top-0 z-10 flex items-end pointer-events-none"
              style={{ width: `${project.totalDuration * PIXELS_PER_SECOND}px`, minWidth: '100%' }}
           >
              {ticks.map((t) => (
                <div 
                  key={t} 
                  className="absolute bottom-0 h-2 border-l border-zinc-600" 
                  style={{ left: `${t * PIXELS_PER_SECOND}px` }}
                >
                  {t % RULER_STEP === 0 && (
                     <span className="absolute -top-5 -left-2 text-[10px] text-zinc-500 select-none">
                        {formatTime(t)}
                     </span>
                  )}
                  {t % RULER_STEP === 0 && <div className="absolute bottom-0 h-4 border-l border-zinc-500"></div>}
                </div>
              ))}
           </div>

           {/* Tracks Render */}
           <div 
            className="relative"
            style={{ width: `${project.totalDuration * PIXELS_PER_SECOND}px` }}
           >
              {project.tracks.map(track => (
                 <div key={track.id} className="h-20 border-b border-zinc-800/50 relative bg-zinc-900/30">
                    {track.clips.map(clip => {
                       const isSelected = project.selectedClipId === clip.id;
                       return (
                         <div
                            key={clip.id}
                            onClick={(e) => handleClipClick(e, clip.id)}
                            className={`absolute top-2 bottom-2 rounded-md overflow-hidden cursor-pointer border-2 transition-colors flex items-center justify-center select-none shadow-sm ${
                               isSelected ? 'border-white z-10' : 'border-transparent hover:border-cyan-500/50'
                            }`}
                            style={{
                               left: `${clip.startTime * PIXELS_PER_SECOND}px`,
                               width: `${clip.duration * PIXELS_PER_SECOND}px`,
                               backgroundColor: clip.color || '#3b82f6'
                            }}
                         >
                            {/* Thumbnails simulated strip */}
                            {track.type === TrackType.VIDEO && clip.src && (
                               <div className="absolute inset-0 opacity-50 flex">
                                  {Array.from({ length: Math.ceil(clip.duration / 3) }).map((_, i) => (
                                     <img key={i} src={clip.src} className="h-full w-auto object-cover grayscale opacity-50" />
                                  ))}
                               </div>
                            )}
                            
                            <span className="relative z-10 text-[10px] font-bold text-white drop-shadow-md truncate px-2">
                               {clip.name}
                            </span>
                         </div>
                       );
                    })}
                 </div>
              ))}

              {/* Playhead */}
              <div 
                className="absolute top-0 bottom-0 w-[1px] bg-red-500 z-50 pointer-events-none shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                style={{ left: `${project.currentTime * PIXELS_PER_SECOND}px` }}
              >
                 <div className="absolute -top-3 -left-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;