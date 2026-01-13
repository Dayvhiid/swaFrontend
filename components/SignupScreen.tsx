import React, { useState } from 'react';
import { ChevronLeft, Check, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
import { churchService, Zone, Area, Parish } from '../services/churchService';
import { useEffect } from 'react';

export default function SignupScreen({ onSignup, onNavigateLogin }: { onSignup: any, onNavigateLogin: any }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    zone: '',
    area: '',
    parish: '',
    role: ''
  });

  const [zones, setZones] = useState<Zone[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [isHierarchyLoading, setIsHierarchyLoading] = useState(false);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const data = await churchService.getZones();
      setZones(data);
    } catch (err) {
      console.error('Failed to fetch zones', err);
    }
  };

  const handleZoneChange = async (zoneId: string) => {
    handleChange('zone', zoneId);
    handleChange('area', '');
    handleChange('parish', '');
    setAreas([]);
    setParishes([]);
    if (zoneId) {
      setIsHierarchyLoading(true);
      try {
        const data = await churchService.getAreas(zoneId);
        setAreas(data);
      } catch (err) {
        console.error('Failed to fetch areas', err);
      } finally {
        setIsHierarchyLoading(false);
      }
    }
  };

  const handleAreaChange = async (areaId: string) => {
    handleChange('area', areaId);
    handleChange('parish', '');
    setParishes([]);
    if (areaId) {
      setIsHierarchyLoading(true);
      try {
        const data = await churchService.getParishes(areaId);
        setParishes(data);
      } catch (err) {
        console.error('Failed to fetch parishes', err);
      } finally {
        setIsHierarchyLoading(false);
      }
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      setIsLoading(true);
      setError(null);
      try {
        // Map UI labels to API fields
        const signupData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          zonalId: formData.zone,
          areaId: formData.area,
          parishId: formData.parish
        };
        const response = await authService.signup(signupData);
        onSignup(response);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Signup failed. Please check your information.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100">
        <button onClick={onNavigateLogin} className="flex items-center text-gray-600">
          <ChevronLeft className="w-5 h-5" />
          <span className="ml-1">Back</span>
        </button>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create Account</h2>
          <p className="text-sm text-gray-500 mb-8">Step {step} of 2</p>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-blue-700' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-blue-700' : 'bg-gray-200'}`} />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl mb-6">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="Enter your phone number"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Zone</label>
                <select
                  value={formData.zone}
                  onChange={(e) => handleZoneChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white"
                  required
                  disabled={isLoading || isHierarchyLoading}
                >
                  <option value="">Select Zone</option>
                  {zones.map(z => <option key={z._id} value={z._id}>{z.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Area</label>
                <select
                  value={formData.area}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white"
                  required
                  disabled={isLoading || isHierarchyLoading || !formData.zone}
                >
                  <option value="">Select Area</option>
                  {areas.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Parish</label>
                <select
                  value={formData.parish}
                  onChange={(e) => handleChange('parish', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white"
                  required
                  disabled={isLoading || isHierarchyLoading || !formData.area}
                >
                  <option value="">Select Parish</option>
                  {parishes.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white"
                  required
                  disabled={isLoading}
                >
                  <option value="">Select Role</option>
                  <option value="soul_winner">Soul Winner</option>
                  <option value="parish_admin">Parish Admin</option>
                  <option value="area_admin">Area Admin</option>
                  <option value="zonal_admin">Zonal Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="w-full mt-8 bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              step === 1 ? 'Continue' : 'Complete Signup'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
