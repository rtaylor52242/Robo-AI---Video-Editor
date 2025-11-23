import React from 'react';
import { ProjectState, Clip, TrackType } from '../types';
import { Icons } from './Icon';

interface CanvasProps {
  project: ProjectState;
}

const Canvas: React.FC<CanvasProps> = ({ project }) => {
  // Find visible clips at current time (in reverse order for Z-index simulation)
  const activeClips: Clip[] = [];
  
  // Sort tracks by simulated z-index (bottom tracks render first)
  const sortedTracks = [...project.tracks]; 
  
  sortedTracks.forEach(track => {
    if (!track.isVisible) return;
    const clip = track.clips.find(c => 
      project.currentTime >= c.startTime && 
      project.currentTime < (c.startTime + c.duration)
    );
    if (clip) activeClips.push(clip);
  });

  const getFormatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 bg-zinc-950 flex flex-col relative overflow-hidden">
      <div className="h-10 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900">
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-white">{getFormatTime(project.currentTime)}</span>
          <span className="text-xs">/ {getFormatTime(project.totalDuration)}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-zinc-400 hover:text-white"><Icons.ZoomOut size={16} /></button>
          <span className="text-xs text-zinc-300">50%</span>
          <button className="text-zinc-400 hover:text-white"><Icons.ZoomIn size={16} /></button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Video Player Container */}
        <div 
          className="relative aspect-video bg-black shadow-2xl overflow-hidden" 
          style={{ width: '100%', maxHeight: '100%', maxWidth: '900px' }}
        >
          {activeClips.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-600 flex-col gap-2">
               <Icons.MonitorUp size={48} className="opacity-20" />
               <span className="text-sm font-medium opacity-50">No media at current frame</span>
            </div>
          )}

          {activeClips.map((clip) => {
            if (clip.type === TrackType.AUDIO) return null; // Audio doesn't render visually here
            
            const isSelected = project.selectedClipId === clip.id;

            return (
              <div
                key={clip.id}
                className="absolute transition-transform origin-center"
                style={{
                  left: `${50 + clip.x}%`, 
                  top: `${50 + clip.y}%`,
                  transform: `translate(-50%, -50%) scale(${clip.scale}) rotate(${clip.rotation}deg)`,
                  opacity: clip.opacity,
                  width: clip.type === TrackType.TEXT ? 'auto' : '100%',
                  height: clip.type === TrackType.TEXT ? 'auto' : '100%',
                  zIndex: isSelected ? 50 : 10,
                }}
              >
                {/* Simulated Content */}
                {clip.type === TrackType.VIDEO && clip.src && (
                  <img src={clip.src} alt="clip" className="w-full h-full object-cover pointer-events-none" />
                )}
                
                {clip.type === TrackType.TEXT && (
                  <div className="text-white font-bold text-4xl drop-shadow-md whitespace-nowrap">
                    {clip.name}
                  </div>
                )}

                {/* Selection Box Overlay */}
                {isSelected && (
                  <div className="absolute -inset-1 border-2 border-cyan-500 pointer-events-none">
                     <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-cyan-500 rounded-full"></div>
                     <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-cyan-500 rounded-full"></div>
                     <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-cyan-500 rounded-full"></div>
                     <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-cyan-500 rounded-full"></div>
                     {/* Rotate handle */}
                     <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer">
                        <Icons.Undo2 size={12} className="text-black transform rotate-90" />
                     </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Canvas;