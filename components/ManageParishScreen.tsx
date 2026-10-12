import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Loader2, CheckCircle2, Church } from 'lucide-react';
import { churchService, HierarchyZone } from '../services/churchService';

export default function ManageParishScreen({ onNavigate }: { onNavigate: any }) {
  const [hierarchyTree, setHierarchyTree] = useState<HierarchyZone[]>([]);
  const [isHierarchyLoading, setIsHierarchyLoading] = useState(true);
  const [zoneId, setZoneId] = useState('');
  const [areaId, setAreaId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchHierarchy();
  }, []);

  const fetchHierarchy = async () => {
    setIsHierarchyLoading(true);
    try {
      const data = await churchService.getHierarchyTree();
      setHierarchyTree(data);
    } catch (err) {
      console.error('Failed to fetch hierarchy tree', err);
      setError('Failed to load zones and areas. Please try again.');
    } finally {
      setIsHierarchyLoading(false);
    }
  };

  const selectedZone = hierarchyTree.find(z => z._id === zoneId);
  const availableAreas = selectedZone ? selectedZone.areas : [];
  const selectedArea = availableAreas.find(a => a._id === areaId);
  const existingParishes = selectedArea ? selectedArea.parishes : [];

  const handleZoneChange = (value: string) => {
    setZoneId(value);
    setAreaId('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await churchService.createParish({
        name: name.trim(),
        areaId,
        ...(description.trim() && { description: description.trim() })
      });
      setSuccess(`"${name.trim()}" has been created under ${selectedArea?.name}.`);
      setName('');
      setDescription('');
      await fetchHierarchy();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create parish. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center">
        <button onClick={() => onNavigate('user-management')} className="mr-3">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <Church className="w-5 h-5 text-blue-700" />
          <h1 className="text-xl font-semibold text-gray-900">Manage Parishes</h1>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        {/* Location Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Location</h3>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Zone *</label>
            <select
              value={zoneId}
              onChange={(e) => handleZoneChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white"
              disabled={isLoading || isHierarchyLoading}
              required
            >
              <option value="">Select Zone</option>
              {hierarchyTree.map(z => (
                <option key={z._id} value={z._id}>{z.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Area *</label>
            <select
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white"
              disabled={isLoading || isHierarchyLoading || !zoneId}
              required
            >
              <option value="">Select Area</option>
              {availableAreas.map(a => (
                <option key={a._id} value={a._id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Parish Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Parish Details</h3>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Parish Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
              placeholder="Enter parish name"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none"
              placeholder="Short description of the parish"
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Existing parishes in selected area */}
        {areaId && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Existing Parishes ({existingParishes.length})
            </h3>
            {existingParishes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {existingParishes.map(p => (
                  <span
                    key={p._id}
                    className="px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 text-sm rounded-full"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No parishes in this area yet.</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !areaId || !name.trim()}
          className="w-full bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
          {isLoading ? 'Creating...' : 'Create Parish'}
        </button>
      </form>
    </div>
  );
}
