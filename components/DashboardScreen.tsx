import React, { useState, useEffect } from 'react';
import { Menu, Users, UserCheck, TrendingUp, ClipboardList, UserX, UserMinus, Loader2 } from 'lucide-react';
import BottomNav from './BottomNav';
import SideMenu from './SideMenu';
import logo from 'figma:asset/612f7289b99c44abc1363d55b6e8ffe9274868e3.png';
import { dashboardService, DashboardStats } from '../services/dashboardService';
import { User } from '../services/authService';

interface DashboardScreenProps {
  onNavigate: (screen: string, id?: string | null) => void;
  user: User | null;
}

const BIBLE_VERSES = [
  {
    text: "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.",
    reference: "Matthew 28:19"
  },
  {
    text: "And he said to them, 'Go into all the world and proclaim the gospel to the whole creation.'",
    reference: "Mark 16:15"
  },
  {
    text: "But you will receive power when the Holy Spirit has come upon you, and you will be my witnesses in Jerusalem and in all Judea and Samaria, and to the end of the earth.",
    reference: "Acts 1:8"
  },
  {
    text: "For the Son of Man came to seek and to save the lost.",
    reference: "Luke 19:10"
  },
  {
    text: "The fruit of the righteous is a tree of life, and whoever captures souls is wise.",
    reference: "Proverbs 11:30"
  },
  {
    text: "And those who are wise shall shine like the brightness of the sky above; and those who turn many to righteousness, like the stars forever and ever.",
    reference: "Daniel 12:3"
  },
  {
    text: "How then will they call on him in whom they have not believed? And how are they to believe in him of whom they have never heard? And how are they to hear without someone preaching?",
    reference: "Romans 10:14"
  },
  {
    text: "Preach the word; be ready in season and out of season; reprove, rebuke, and exhort, with complete patience and teaching.",
    reference: "2 Timothy 4:2"
  }
]; // well do this better latter

export default function DashboardScreen({ onNavigate, user }: DashboardScreenProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [verse] = useState(() => BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [summaryStats, pendingFollowUps] = await Promise.all([
          dashboardService.getSummaryStats(),
          dashboardService.getPendingFollowUps()
        ]);
        setStats(summaryStats);
        setPendingCount(pendingFollowUps.length);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Redeem Logo" className="w-10 h-10 object-contain" />
          <span className="text-lg font-semibold text-gray-900">LP 77</span>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 hover:bg-gray-50 rounded-lg"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="px-6 py-6">
        {/* Bible Verse Card */}
        <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-100">
          <p className="text-sm text-blue-900 italic leading-relaxed mb-2">
            "{verse.text}"
          </p>
          <p className="text-xs text-blue-700">— {verse.reference}</p>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-700 animate-spin" />
            </div>
          ) : (
            <>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-700" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalConverts || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Total Converts</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-green-700" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeConverts || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Active Converts</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <UserMinus className="w-5 h-5 text-gray-700" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{(stats?.totalConverts || 0) - (stats?.activeConverts || 0)}</p>
                <p className="text-xs text-gray-500 mt-1">Inactive Converts</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-700" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats?.retentionRate || '0.00'}%</p>
                <p className="text-xs text-gray-500 mt-1">Retention Rate</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-orange-700" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                <p className="text-xs text-gray-500 mt-1">Pending Follow-ups</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <UserX className="w-5 h-5 text-red-700" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats?.completedConverts || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Completed Converts</p>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons (no heading) */}
        <div className="space-y-3">
          <button
            onClick={() => onNavigate('add-convert')}
            className="w-full bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800 transition-colors text-sm font-medium"
          >
            Add New Convert
          </button>
          <button
            onClick={() => onNavigate('converts-list')}
            className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            View All Converts
          </button>
        </div>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={onNavigate} user={user} />
    </div>
  );
}