import React, { useState } from 'react';
import { ChannelCategory, GenreType, TVProgram, VideoSource } from '../types/tv';
import { playButtonBeep, playKnobClick } from '../utils/audioEffects';
import {
  Settings,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  RotateCcw,
  Download,
  Upload,
  X,
  Tv,
  CheckCircle2,
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  programs: TVProgram[];
  onAddProgram: (program: TVProgram) => void;
  onDeleteProgram: (id: string) => void;
  onResetToDefaults: () => void;
  onImportPrograms: (programs: TVProgram[]) => void;
}

const CATEGORIES: ChannelCategory[] = [
  'Black & White Classics',
  '1950s–1960s Television',
  '1970s Classics',
  '1980s Television',
  'Classic Hollywood Movies',
  'Vintage Cartoons',
  'Old Commercials',
  'Classic Music & Concerts',
  'Historical Documentaries',
  'Retro Radio & Audio',
];

const GENRES: GenreType[] = [
  'Cartoons',
  'Comedy',
  'Commercials',
  'Drama',
  'Gameshows',
  'Movies',
  'Music',
  'News',
  'Documentary',
  'Sci-Fi',
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  programs,
  onAddProgram,
  onDeleteProgram,
  onResetToDefaults,
  onImportPrograms,
}) => {
  const [activeTab, setActiveTab] = useState<'manage' | 'add' | 'settings'>('manage');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Program Form State
  const [newTitle, setNewTitle] = useState('');
  const [newChannelNumber, setNewChannelNumber] = useState(12);
  const [newChannelName, setNewChannelName] = useState('CUSTOM 12');
  const [newDecade, setNewDecade] = useState<'1950s' | '1960s' | '1970s' | '1980s' | '1990s'>('1980s');
  const [newYear, setNewYear] = useState(1985);
  const [newGenre, setNewGenre] = useState<GenreType>('Movies');
  const [newCategory, setNewCategory] = useState<ChannelCategory>('Classic Hollywood Movies');
  const [newSource, setNewSource] = useState<VideoSource>('youtube');
  const [newVideoId, setNewVideoId] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDuration, setNewDuration] = useState('24:00');
  const [newIsPublicDomain, setNewIsPublicDomain] = useState(true);

  if (!isOpen) return null;

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newVideoId.trim()) {
      showStatus('Please provide a program title and video ID/URL.');
      return;
    }

    // Extract youtube ID if full URL pasted
    let cleanedId = newVideoId.trim();
    if (cleanedId.includes('youtube.com/watch?v=')) {
      const match = cleanedId.match(/v=([a-zA-Z0-9_-]+)/);
      if (match) cleanedId = match[1];
    } else if (cleanedId.includes('youtu.be/')) {
      const match = cleanedId.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (match) cleanedId = match[1];
    }

    const item: TVProgram = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      channelNumber: Number(newChannelNumber) || 12,
      channelName: newChannelName.trim() || 'CUSTOM TV',
      decade: newDecade,
      year: Number(newYear) || 1980,
      genre: newGenre,
      category: newCategory,
      source: newSource,
      videoId: cleanedId,
      description: newDescription.trim() || 'Vintage broadcast program.',
      duration: newDuration.trim() || '20:00',
      isPublicDomain: newIsPublicDomain,
      licenseInfo: newIsPublicDomain ? 'Public Domain' : 'Authorized Embed',
      featured: false,
    };

    onAddProgram(item);
    playButtonBeep();
    showStatus(`Successfully added "${item.title}" to Channel ${item.channelNumber}`);
    setNewTitle('');
    setNewVideoId('');
    setNewDescription('');
    setActiveTab('manage');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(programs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `classic_tv_channels_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showStatus('Exported channel catalog to JSON.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onImportPrograms(parsed);
            showStatus(`Imported ${parsed.length} channels successfully!`);
          } else {
            showStatus('Invalid channels JSON format.');
          }
        } catch {
          showStatus('Error parsing uploaded JSON file.');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[85vh] bg-[#1a1b22] border-2 border-stone-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-200">
        {/* Header */}
        <div className="bg-[#121318] px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-white font-bold text-base tracking-wide">
                Classic TV Station Administrator
              </h2>
              <p className="text-xs text-stone-400 font-mono">
                Manage virtual channels, public domain sources, playlists, and stream health
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playButtonBeep();
              onClose();
            }}
            className="p-1 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status notification toast */}
        {statusMessage && (
          <div className="bg-amber-500/20 border-b border-amber-500/40 text-amber-200 px-6 py-2 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-stone-900/90 px-6 border-b border-stone-800 flex items-center gap-4 text-xs font-mono">
          <button
            onClick={() => {
              playButtonBeep();
              setActiveTab('manage');
            }}
            className={`py-3 border-b-2 font-medium transition-colors ${
              activeTab === 'manage'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Channel Directory ({programs.length})
          </button>

          <button
            onClick={() => {
              playButtonBeep();
              setActiveTab('add');
            }}
            className={`py-3 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'add'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Add Program / Channel
          </button>

          <button
            onClick={() => {
              playButtonBeep();
              setActiveTab('settings');
            }}
            className={`py-3 border-b-2 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Import / Export & Reset
          </button>
        </div>

        {/* Tab 1: Channel Directory */}
        {activeTab === 'manage' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-stone-400 pb-2 border-b border-stone-800">
              <span>{programs.length} active broadcast programs loaded</span>
              <button
                onClick={() => {
                  playButtonBeep();
                  setActiveTab('add');
                }}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Channel
              </button>
            </div>

            <div className="space-y-2">
              {programs.map((p) => (
                <div
                  key={p.id}
                  className="bg-stone-900/60 rounded-xl p-3 border border-stone-800 flex items-center justify-between gap-4 hover:border-stone-700 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="px-2 py-1 bg-stone-950 border border-stone-700 rounded text-amber-300 font-crt text-lg shrink-0">
                      CH {p.channelNumber}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-stone-100 truncate">
                        {p.title}
                      </div>
                      <div className="text-xs font-mono text-stone-400 flex items-center gap-2">
                        <span>{p.channelName}</span>
                        <span>·</span>
                        <span>{p.decade} ({p.year})</span>
                        <span>·</span>
                        <span>{p.genre}</span>
                        <span>·</span>
                        <span className="text-stone-500">[{p.source}: {p.videoId}]</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        playButtonBeep();
                        onDeleteProgram(p.id);
                        showStatus(`Removed "${p.title}"`);
                      }}
                      className="p-1.5 text-stone-500 hover:text-red-400 hover:bg-stone-800 rounded transition-colors"
                      title="Delete program"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Add New Program */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddNew} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leave It to Beaver: Beaver Gets a Goldfish"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1">
                  Video Source & ID or URL *
                </label>
                <div className="flex gap-2">
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value as VideoSource)}
                    className="bg-stone-950 border border-stone-700 rounded-lg p-2 text-xs font-mono text-stone-100"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="archive_org">Archive.org</option>
                    <option value="direct">Direct MP4</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Video ID (e.g. W6q38jMhHkE) or full URL"
                    value={newVideoId}
                    onChange={(e) => setNewVideoId(e.target.value)}
                    className="flex-1 bg-stone-950 border border-stone-700 rounded-lg p-2 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1">
                  Virtual Channel Number (2 to 99)
                </label>
                <input
                  type="number"
                  min="2"
                  max="99"
                  value={newChannelNumber}
                  onChange={(e) => setNewChannelNumber(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-xs font-mono text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1">
                  Channel Name & Call Sign
                </label>
                <input
                  type="text"
                  placeholder="e.g. WRETRO 12"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-xs font-mono text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ChannelCategory)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-xs font-mono text-stone-100"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1">
                  Genre
                </label>
                <select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value as GenreType)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-xs font-mono text-stone-100"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1">
                  Decade & Air Year
                </label>
                <div className="flex gap-2">
                  <select
                    value={newDecade}
                    onChange={(e) => setNewDecade(e.target.value as any)}
                    className="bg-stone-950 border border-stone-700 rounded-lg p-2 text-xs font-mono text-stone-100 flex-1"
                  >
                    <option value="1950s">1950s</option>
                    <option value="1960s">1960s</option>
                    <option value="1970s">1970s</option>
                    <option value="1980s">1980s</option>
                    <option value="1990s">1990s</option>
                  </select>
                  <input
                    type="number"
                    min="1920"
                    max="2005"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-24 bg-stone-950 border border-stone-700 rounded-lg p-2 text-xs font-mono text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1">
                  Approximate Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24:30"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-xs font-mono text-stone-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-400 mb-1">
                Program Synopsis / Historical Notes
              </label>
              <textarea
                rows={3}
                placeholder="Enter description, broadcast network, episode background..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="publicDomain"
                checked={newIsPublicDomain}
                onChange={(e) => setNewIsPublicDomain(e.target.checked)}
                className="w-4 h-4 rounded bg-stone-950 border-stone-700 accent-amber-500"
              />
              <label htmlFor="publicDomain" className="text-xs font-mono text-stone-300">
                Confirmed Public Domain or Openly Permitted Broadcast
              </label>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase shadow"
              >
                Save & Broadcast Channel
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Import / Export & Reset */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-stone-900/60 p-4 rounded-xl border border-stone-800">
              <h3 className="text-sm font-bold text-stone-100 mb-1 flex items-center gap-2">
                <Download className="w-4 h-4 text-amber-400" /> Export Channel Catalog
              </h3>
              <p className="text-xs text-stone-400 mb-3">
                Download your complete curated schedule of channels and video streams as a JSON backup file.
              </p>
              <button
                onClick={handleExportJSON}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 rounded-lg text-xs font-mono flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Download channels.json
              </button>
            </div>

            <div className="bg-stone-900/60 p-4 rounded-xl border border-stone-800">
              <h3 className="text-sm font-bold text-stone-100 mb-1 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" /> Import Channel Catalog
              </h3>
              <p className="text-xs text-stone-400 mb-3">
                Upload a custom JSON playlist file to overwrite or expand available channels.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-stone-700 rounded-lg text-xs font-mono cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> Select JSON File to Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>

            <div className="bg-red-950/20 p-4 rounded-xl border border-red-900/40">
              <h3 className="text-sm font-bold text-red-300 mb-1 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-red-400" /> Reset to Factory Default Channels
              </h3>
              <p className="text-xs text-stone-400 mb-3">
                Revert back to the pristine initial public domain curated channels catalog. Custom channels will be reset.
              </p>
              <button
                onClick={() => {
                  onResetToDefaults();
                  showStatus('Restored factory default channels catalog!');
                }}
                className="px-4 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-200 border border-red-800 rounded-lg text-xs font-mono flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restore Factory Schedule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
