import React from 'react';
import { Icons } from './Icon';

interface HeaderProps {
  projectName: string;
}

const Header: React.FC<HeaderProps> = ({ projectName }) => {
  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-cyan-500/20">
          R
        </div>
        <div className="flex items-center gap-4 text-zinc-400 text-sm">
          <span className="hover:text-white cursor-pointer">File</span>
          <span className="hover:text-white cursor-pointer">Edit</span>
          <span className="hover:text-white cursor-pointer">Window</span>
          <span className="hover:text-white cursor-pointer">Help</span>
        </div>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 font-medium text-zinc-300">
        {projectName}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-zinc-400 text-xs px-2">Autosaved</div>
        <button className="h-8 px-4 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2">
          <Icons.Download size={14} />
          Export
        </button>
      </div>
    </header>
  );
};

export default Header;