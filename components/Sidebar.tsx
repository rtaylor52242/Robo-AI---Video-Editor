import React, { useState } from 'react';
import { Icons } from './Icon';
import { TabOption } from '../types';

interface SidebarProps {
  onAddClip: (type: 'video' | 'audio' | 'text', src?: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddClip }) => {
  const [activeTab, setActiveTab] = useState<TabOption>(TabOption.MEDIA);

  const tabs = [
    { id: TabOption.MEDIA, label: 'Media', icon: Icons.Layers },
    { id: TabOption.AUDIO, label: 'Audio', icon: Icons.Music },
    { id: TabOption.TEXT, label: 'Text', icon: Icons.Type },
    { id: TabOption.EFFECTS, label: 'Effects', icon: Icons.Wand2 },
    { id: TabOption.AI_TOOLS, label: 'AI Tools', icon: Icons.Sun },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case TabOption.MEDIA:
        return (
          <div className="grid grid-cols-2 gap-3 p-4">
             <button className="col-span-2 h-10 border border-dashed border-zinc-700 rounded text-zinc-500 text-sm flex items-center justify-center hover:border-zinc-500 hover:text-zinc-300 transition-colors">
               <Icons.Plus size={16} className="mr-2" /> Import Media
             </button>
             {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="aspect-video bg-zinc-800 rounded overflow-hidden relative group cursor-pointer border border-transparent hover:border-cyan-500"
                  onClick={() => onAddClip('video', `https://picsum.photos/id/${10 + i}/400/225`)}
                >
                  <img src={`https://picsum.photos/id/${10 + i}/400/225`} alt="Asset" className="w-full h-full object-cover" />
                  <div className="absolute bottom-1 right-1 bg-black/70 px-1 rounded text-[10px] text-white">00:05</div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Icons.Plus className="text-white drop-shadow-md" size={24} />
                  </div>
                </div>
             ))}
          </div>
        );
      case TabOption.TEXT:
        return (
          <div className="p-4 space-y-3">
             <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">Basic Text</div>
             <div 
                className="h-12 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center cursor-pointer hover:bg-zinc-750 hover:border-cyan-500"
                onClick={() => onAddClip('text')}
             >
                <span className="text-xl font-bold text-white">Default Text</span>
             </div>
             <div className="h-12 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center cursor-pointer hover:bg-zinc-750 hover:border-cyan-500">
                <span className="text-xl font-serif text-yellow-400">Cinematic</span>
             </div>
             <div className="h-12 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center cursor-pointer hover:bg-zinc-750 hover:border-cyan-500">
                <span className="text-xl font-mono text-cyan-400 bg-black px-2">NEON</span>
             </div>
          </div>
        );
      case TabOption.AI_TOOLS:
        return (
          <div className="p-4 space-y-4">
             <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <div className="flex items-center gap-2 mb-2 text-cyan-400">
                   <Icons.Wand2 size={16} />
                   <span className="font-semibold text-sm">Magic Generator</span>
                </div>
                <p className="text-xs text-zinc-400 mb-3">Generate clips using Google Gemini.</p>
                <input type="text" placeholder="Describe your scene..." className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs text-white mb-2 focus:outline-none focus:border-cyan-500" />
                <button className="w-full h-8 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded font-medium">Generate</button>
             </div>
             <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <div className="flex items-center gap-2 mb-2 text-purple-400">
                   <Icons.Type size={16} />
                   <span className="font-semibold text-sm">Auto Captions</span>
                </div>
                <p className="text-xs text-zinc-400 mb-3">Transcribe audio to text tracks.</p>
                <button className="w-full h-8 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded font-medium">Start Recognition</button>
             </div>
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
            Coming soon
          </div>
        );
    }
  }

  return (
    <div className="flex h-full border-r border-zinc-800 bg-zinc-900">
      <div className="w-16 flex flex-col items-center py-4 space-y-4 border-r border-zinc-800 bg-zinc-950">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all w-14 ${
              activeTab === tab.id ? 'bg-zinc-800 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <tab.icon size={20} strokeWidth={1.5} />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="w-64 flex flex-col bg-zinc-900">
         <div className="h-10 border-b border-zinc-800 flex items-center px-4">
           <div className="relative w-full">
             <Icons.Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" />
             <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-zinc-950 border border-zinc-800 rounded pl-8 pr-2 py-1 text-xs text-white focus:outline-none focus:border-zinc-600"
             />
           </div>
         </div>
         <div className="flex-1 overflow-y-auto custom-scrollbar">
            {renderContent()}
         </div>
      </div>
    </div>
  );
};

export default Sidebar;