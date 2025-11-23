import React from 'react';
import { ProjectState, Clip, TrackType } from '../types';
import { Icons } from './Icon';

interface PropertiesPanelProps {
  project: ProjectState;
  updateClip: (id: string, updates: Partial<Clip>) => void;
  deleteClip: (id: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ project, updateClip, deleteClip }) => {
  const selectedClip = project.tracks
    .flatMap(t => t.clips)
    .find(c => c.id === project.selectedClipId);

  if (!selectedClip) {
    return (
      <div className="w-72 bg-zinc-900 border-l border-zinc-800 flex items-center justify-center text-zinc-500 text-sm flex-col gap-3">
        <Icons.LayoutTemplate size={32} className="opacity-20" />
        <p>Select a clip to edit</p>
      </div>
    );
  }

  const handleChange = (field: keyof Clip, value: number) => {
    updateClip(selectedClip.id, { [field]: value });
  };

  return (
    <div className="w-72 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full overflow-y-auto">
      <div className="h-12 border-b border-zinc-800 flex items-center px-4 font-semibold text-sm text-zinc-200 justify-between">
        <span>{selectedClip.type.charAt(0).toUpperCase() + selectedClip.type.slice(1)} Properties</span>
        <button 
          onClick={() => deleteClip(selectedClip.id)}
          className="text-zinc-500 hover:text-red-400 transition-colors"
        >
          <Icons.Trash2 size={16} />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Transform Section */}
        {(selectedClip.type === TrackType.VIDEO || selectedClip.type === TrackType.TEXT) && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
              <Icons.SplitSquareHorizontal size={14} /> Transform
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Scale</span>
                  <span>{Math.round(selectedClip.scale * 100)}%</span>
                </div>
                <input 
                  type="range" min="0.1" max="3" step="0.1"
                  value={selectedClip.scale}
                  onChange={(e) => handleChange('scale', parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Rotation</span>
                  <span>{selectedClip.rotation}°</span>
                </div>
                <input 
                  type="range" min="-180" max="180" step="1"
                  value={selectedClip.rotation}
                  onChange={(e) => handleChange('rotation', parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                 <div className="space-y-1">
                   <label className="text-xs text-zinc-500">Position X</label>
                   <input 
                     type="number" 
                     value={selectedClip.x}
                     onChange={(e) => handleChange('x', parseInt(e.target.value))}
                     className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 focus:border-cyan-500 focus:outline-none"
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs text-zinc-500">Position Y</label>
                   <input 
                     type="number" 
                     value={selectedClip.y}
                     onChange={(e) => handleChange('y', parseInt(e.target.value))}
                     className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 focus:border-cyan-500 focus:outline-none"
                   />
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Opacity Section */}
        <div className="space-y-4 border-t border-zinc-800 pt-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
              <Icons.Sun size={14} /> Visibility
            </div>
             <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Opacity</span>
                  <span>{Math.round(selectedClip.opacity * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01"
                  value={selectedClip.opacity}
                  onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
        </div>

        {/* Audio Volume */}
        {(selectedClip.type === TrackType.AUDIO || selectedClip.type === TrackType.VIDEO) && (
          <div className="space-y-4 border-t border-zinc-800 pt-4">
             <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
              <Icons.Volume2 size={14} /> Audio
            </div>
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Volume</span>
                  <span>{Math.round((selectedClip.volume || 1) * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="2" step="0.1"
                  value={selectedClip.volume ?? 1}
                  onChange={(e) => handleChange('volume', parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;