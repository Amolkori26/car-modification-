import React, { useState, useEffect } from 'react';
import { GalleryProject, BookingConfig } from '../types';
import {
  Heart,
  MessageSquare,
  Share2,
  Sparkles,
  Zap,
  Gauge,
  PlusCircle,
  X,
  Check,
  Calendar,
  Layers,
  DollarSign
} from 'lucide-react';

interface UserGalleryProps {
  initialConfigToPublish?: BookingConfig | null;
  initialVehicleName?: string;
  isPublishModalOpen?: boolean;
  onClosePublishModal?: () => void;
  onNavigateToCustomizer?: () => void;
}

export const UserGallery: React.FC<UserGalleryProps> = ({
  initialConfigToPublish,
  initialVehicleName = '',
  isPublishModalOpen = false,
  onClosePublishModal,
  onNavigateToCustomizer,
}) => {
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [inspectProject, setInspectProject] = useState<GalleryProject | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form states for publishing custom build
  const [newTitle, setNewTitle] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newVehicle, setNewVehicle] = useState(initialVehicleName || 'Nissan GT-R R35 Nismo');
  const [newHp, setNewHp] = useState(750);
  const [newCategory, setNewCategory] = useState<'Track Weapon' | 'Street Sleeper' | 'Stance & Show' | 'Cyber Luxury'>('Track Weapon');
  const [newDescription, setNewDescription] = useState('');
  const [newParts, setNewParts] = useState('Acid Lime Wrap, Titanium Valved Exhaust, Stage 2 ECU, Forged Wheels');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  useEffect(() => {
    if (isPublishModalOpen) {
      setShowSubmitModal(true);
      if (initialVehicleName) setNewVehicle(initialVehicleName);
      if (initialConfigToPublish) {
        setNewTitle(`${initialVehicleName} - Vertex ${initialConfigToPublish.paintName}`);
        setNewParts(`${initialConfigToPublish.paintName} Wrap, ${initialConfigToPublish.rimsName}, ${initialConfigToPublish.tuningStage}, ${initialConfigToPublish.aeroKit}`);
      }
    }
  }, [isPublishModalOpen, initialConfigToPublish, initialVehicleName]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/gallery/${id}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, likes: data.likes, hasLiked: true } : p
          )
        );
      }
    } catch (err) {
      console.error('Failed to like project:', err);
    }
  };

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newOwner.trim()) return;

    try {
      setSubmitting(true);
      const partsArray = newParts.split(',').map((p) => p.trim()).filter(Boolean);
      const payload = {
        title: newTitle,
        ownerName: newOwner,
        vehicle: newVehicle,
        year: '2024',
        hp: Number(newHp),
        torque: `${Math.round(newHp * 1.15)} Nm`,
        category: newCategory,
        description: newDescription || 'Custom personalized build tuned at Vertex Customs.',
        installedParts: partsArray,
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
        totalCost: 14500,
        buildTime: '2.5 Weeks',
      };

      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setProjects((prev) => [data.data, ...prev]);
        setShowSubmitModal(false);
        if (onClosePublishModal) onClosePublishModal();
        setNewTitle('');
        setNewOwner('');
        setNewDescription('');
      }
    } catch (err) {
      console.error('Failed to submit gallery build:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filters = ['All', 'Track Weapon', 'Cyber Luxury', 'Street Sleeper', 'Stance & Show'];

  const filteredProjects = projects.filter((p) => {
    if (selectedFilter === 'All') return true;
    return p.category === selectedFilter;
  });

  return (
    <section id="gallery" className="relative py-20 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Community & Workshop Showcase
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white font-['Rajdhani'] uppercase">
            Custom Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400">Galleries</span>
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-xl mt-1">
            Explore finished client masterpieces, inspect parts lists, and publish your own vehicle modification project.
          </p>
        </div>

        {/* Publish Your Build CTA */}
        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-fuchsia-600/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Publish Your Custom Build
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {filters.map((fil) => (
          <button
            key={fil}
            onClick={() => setSelectedFilter(fil)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === fil
                ? 'bg-fuchsia-600 text-white font-bold shadow-[0_0_15px_rgba(192,38,211,0.4)]'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
            }`}
          >
            {fil}
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-mono text-neutral-400">Loading custom user builds...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setInspectProject(project)}
              className="group rounded-3xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-[0_0_30px_rgba(192,38,211,0.15)]"
            >
              <div>
                {/* Hero Photo of Vehicle */}
                <div className="relative h-64 md:h-72 overflow-hidden bg-neutral-950">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-neutral-950/80 backdrop-blur-md text-fuchsia-400 border border-neutral-800">
                      {project.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-lime-500 text-neutral-950 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {project.hp} HP
                    </span>
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLike(project.id, e)}
                    className={`absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                      project.hasLiked
                        ? 'bg-rose-500 text-white'
                        : 'bg-neutral-950/70 text-neutral-300 hover:text-rose-400 hover:bg-neutral-900'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${project.hasLiked ? 'fill-current' : ''}`} />
                  </button>

                  {/* Color & Wheel tag */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-950/80 border border-neutral-800 text-[11px] text-neutral-300">
                      <span
                        className="w-3 h-3 rounded-full border border-white/30"
                        style={{ backgroundColor: project.colorHex || '#84cc16' }}
                      />
                      <span>{project.colorName}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-fuchsia-400 transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-xs font-mono text-neutral-400">{project.vehicle}</span>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Installed Parts Badges preview */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.installedParts.slice(0, 4).map((part, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300"
                      >
                        ✓ {part}
                      </span>
                    ))}
                    {project.installedParts.length > 4 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        +{project.installedParts.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer: Owner & Stats */}
              <div className="px-6 py-4 border-t border-neutral-800/80 bg-neutral-950/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-mono text-xs font-bold text-fuchsia-400">
                    {project.ownerName ? project.ownerName.charAt(0) : 'U'}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-200 block">{project.ownerName}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">Build Time: {project.buildTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1 text-rose-400">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    {project.likes}
                  </span>
                  <span className="text-lime-400 font-bold">
                    ₹{project.totalCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect Project Modal */}
      {inspectProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-neutral-900 border border-neutral-800 p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => setInspectProject(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30">
                {inspectProject.category}
              </span>
              <span className="text-xs font-mono text-neutral-400">{inspectProject.vehicle}</span>
            </div>

            <h3 className="text-2xl font-black text-white uppercase font-['Rajdhani'] mb-2">
              {inspectProject.title}
            </h3>
            <p className="text-sm text-neutral-300 mb-6 leading-relaxed">
              {inspectProject.description}
            </p>

            {/* Photo */}
            <div className="rounded-2xl overflow-hidden mb-6 h-64 border border-neutral-800">
              <img src={inspectProject.image} alt={inspectProject.title} className="w-full h-full object-cover" />
            </div>

            {/* Spec breakdown */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] uppercase font-mono text-neutral-400 block">Peak Power</span>
                <span className="text-lg font-bold font-mono text-lime-400">{inspectProject.hp} BHP</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] uppercase font-mono text-neutral-400 block">Max Torque</span>
                <span className="text-lg font-bold font-mono text-cyan-400">{inspectProject.torque}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] uppercase font-mono text-neutral-400 block">Total Investment</span>
                <span className="text-lg font-bold font-mono text-fuchsia-400">₹{inspectProject.totalCost.toLocaleString()}</span>
              </div>
            </div>

            {/* Full Parts List */}
            <div className="mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-lime-400" />
                Installed Modification Package
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {inspectProject.installedParts.map((pt, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200">
                    <Check className="w-3.5 h-3.5 text-lime-400" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
              <div className="flex items-center gap-3">
                <img src={inspectProject.ownerAvatar} className="w-8 h-8 rounded-full" />
                <div>
                  <span className="text-xs font-bold text-white block">{inspectProject.ownerName}</span>
                  <span className="text-[10px] text-neutral-400">Verified Workshop Project</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setInspectProject(null);
                  if (onNavigateToCustomizer) {
                    onNavigateToCustomizer();
                  } else {
                    const el = document.getElementById('customizer');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-lime-400 text-neutral-950 font-bold text-xs uppercase cursor-pointer"
              >
                Customize Similar Build
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Custom Build Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => {
                setShowSubmitModal(false);
                if (onClosePublishModal) onClosePublishModal();
              }}
              className="absolute top-5 right-5 p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-fuchsia-400 uppercase tracking-wider block mb-1">
              Community Gallery Submission
            </span>
            <h3 className="text-2xl font-bold text-white font-['Rajdhani'] mb-4">
              Publish Your Custom Project
            </h3>

            <form onSubmit={handlePublishSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Build Name / Project Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Apex Viper ACR Track Spec"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-fuchsia-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Your Name / Handle</label>
                  <input
                    type="text"
                    required
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    placeholder="e.g. Alex Thorne"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-fuchsia-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Base Vehicle</label>
                  <input
                    type="text"
                    required
                    value={newVehicle}
                    onChange={(e) => setNewVehicle(e.target.value)}
                    placeholder="e.g. Nissan GT-R R35"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-fuchsia-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Horsepower (BHP)</label>
                  <input
                    type="number"
                    value={newHp}
                    onChange={(e) => setNewHp(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-fuchsia-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as typeof newCategory)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-fuchsia-500 focus:outline-none"
                  >
                    <option value="Track Weapon">Track Weapon</option>
                    <option value="Street Sleeper">Street Sleeper</option>
                    <option value="Cyber Luxury">Cyber Luxury</option>
                    <option value="Stance & Show">Stance & Show</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Installed Mods & Parts (comma-separated)</label>
                <input
                  type="text"
                  value={newParts}
                  onChange={(e) => setNewParts(e.target.value)}
                  placeholder="Acid Lime Wrap, Titanium Exhaust, Forged Wheels, Stage 2 ECU"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-fuchsia-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Build Notes / Story</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Tell the community about your build journey..."
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-fuchsia-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubmitModal(false);
                    if (onClosePublishModal) onClosePublishModal();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold uppercase cursor-pointer"
                >
                  {submitting ? 'Publishing...' : 'Submit to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
