import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import BottomNav from './BottomNav';
import { dashboardService, DashboardStats } from '../services/dashboardService';
import { churchService, Area } from '../services/churchService';

export default function ZonalAdminScreen({ onNavigate, user }: { onNavigate: any, user: any }) {
  const [selectedArea, setSelectedArea] = useState('');
  const [areas, setAreas] = useState<Area[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.zonalId) {
      fetchAreas();
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [selectedArea, user]);

  const fetchAreas = async () => {
    try {
      const data = await churchService.getAreas(user.zonalId);
      setAreas(data);
    } catch (err) {
      console.error('Failed to fetch areas', err);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    const filters: any = {};
    if (selectedArea) {
      filters.areaId = selectedArea;
    } else if (user?.zonalId) {
      filters.zonalId = user.zonalId;
    }

    try {
      const [summaryStats, growthTrends] = await Promise.all([
        dashboardService.getSummaryStats(filters),
        dashboardService.getGrowthTrends(filters)
      ]);
      setStats(summaryStats);
      setTrends(growthTrends);
    } catch (err) {
      setError('Failed to load zonal data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    alert('Exporting zonal report...');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-blue-700 animate-spin mb-4" />
        <p className="text-gray-600">Loading zonal data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center">
        <button onClick={() => onNavigate('dashboard')} className="mr-3">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Zonal Admin</h1>
      </div>

      <div className="px-6 py-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Area Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Select Area</label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
          >
            <option value="">All Areas</option>
            {areas.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Total Converts</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalConverts || 0}</p>
            <p className="text-xs text-green-600 mt-1">Overall</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Active Follow-ups</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.activeConverts || 0}</p>
            <p className="text-xs text-blue-600 mt-1">In Progress</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Retention Rate</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.retentionRate || '0%'}</p>
            <p className="text-xs text-green-600 mt-1">Growth</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.completedConverts || 0}</p>
            <p className="text-xs text-purple-600 mt-1">Stabilized</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Zonal Growth Trend</h3>
          {trends.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
              No trend data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#1e40af"
                  strokeWidth={2}
                  dot={{ fill: '#1e40af', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Parish Breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Performing Areas</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Central Area</span>
              <span className="text-sm font-semibold text-gray-900">329 converts</span>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="w-full bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export Zonal Report
        </button>
      </div>

      <BottomNav active="reports" onNavigate={onNavigate} />
    </div>
  );
}