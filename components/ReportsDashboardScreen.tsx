import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, FileText, Loader2, AlertCircle } from 'lucide-react';
import BottomNav from './BottomNav';
import { dashboardService } from '../services/dashboardService';

interface TrendData {
  month: string;
  converts: number;
}

export default function ReportsDashboardScreen({ onNavigate }) {
  const [parish, setParish] = useState('');
  const [area, setArea] = useState('');
  const [zone, setZone] = useState('');
  const [timePeriod, setTimePeriod] = useState<'daily' | 'monthly'>('monthly');
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [parish, area, zone, timePeriod]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryStats, growthTrends] = await Promise.all([
        dashboardService.getSummaryStats(),
        dashboardService.getGrowthTrends({ period: timePeriod })
      ]);
      console.log('Growth Trends Data:', growthTrends);

      // Transform the data to the correct format for the chart
      let transformedTrends: TrendData[];

      if (timePeriod === 'daily') {
        // For daily data, format as "Jan 1", "Jan 2", etc.
        transformedTrends = growthTrends.map(item => {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const date = new Date(item.date || item._id);
          const month = monthNames[date.getMonth()];
          const day = date.getDate();
          return {
            month: `${month} ${day}`,
            converts: item.count || 0
          };
        });
      } else {
        // For monthly data
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        transformedTrends = growthTrends.map(item => ({
          month: monthNames[item._id - 1] || `Month ${item._id}`,
          converts: item.count || 0
        }));
      }

      console.log('Transformed Trends:', transformedTrends);
      setStats(summaryStats);
      setTrends(transformedTrends);
    } catch (err) {
      setError('Failed to load dashboard report data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-blue-700 animate-spin mb-4" />
        <p className="text-gray-600">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Reports Dashboard</h1>
        <button onClick={() => fetchData()} className="p-2 text-gray-500 hover:text-blue-700">
          <Download className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 py-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
          <div className="grid grid-cols-3 gap-2">
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="">Zone</option>
              <option value="north">North</option>
              <option value="south">South</option>
            </select>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="">Area</option>
              <option value="central">Central</option>
            </select>
            <select
              value={parish}
              onChange={(e) => setParish(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="">Parish</option>
              <option value="grace">Grace</option>
            </select>
          </div>
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
            <p className="text-xs text-gray-500 mb-1">Avg Retention</p>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Converts Growth</h3>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTimePeriod('daily')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timePeriod === 'daily'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Daily
              </button>
              <button
                onClick={() => setTimePeriod('monthly')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timePeriod === 'monthly'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Monthly
              </button>
            </div>
          </div>
          {!trends || trends.length === 0 ? (
            <div className="h-[200px] flex flex-col items-center justify-center text-gray-400 text-sm">
              <p>No trend data available</p>
              <p className="text-xs mt-2">({trends ? 'Empty array' : 'No data'})</p>
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
                  dataKey="converts"
                  stroke="#1e40af"
                  strokeWidth={2}
                  dot={{ fill: '#1e40af', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onNavigate('detailed-report')}
          className="w-full bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
        >
          <FileText className="w-5 h-5" />
          View Detailed Reports
        </button>
      </div>

      <BottomNav active="reports" onNavigate={onNavigate} />
    </div>
  );
}
