/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  CreditCard, 
  ShieldCheck, 
  UserPlus, 
  HelpCircle,
  Award,
  Zap
} from 'lucide-react';
import { User } from '../types';

interface SettingsProps {
  token: string | null;
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
}

export default function Settings({ token, currentUser, onUpdateUser }: SettingsProps) {
  const [loading, setLoading] = useState(false);
  const [activePlan, setActivePlan] = useState<'free' | 'pro' | 'enterprise'>(currentUser.subscription);

  const handleUpdateSubscription = async (tier: 'free' | 'pro' | 'enterprise') => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'default-user'}`
        },
        body: JSON.stringify({ tier })
      });

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      
      onUpdateUser(data.user);
      setActivePlan(tier);
      alert(`Simulated subscription tier updated successfully to ${tier.toUpperCase()}!`);
    } catch (err: any) {
      alert('Failed to update subscription tier: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="settings-tab">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Account Configuration</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage mock environments, security roles, and active plan scopes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column info */}
        <div className="md:col-span-1 p-5.5 rounded-2xl bg-zinc-900/50 border border-zinc-800 h-fit space-y-4 backdrop-blur">
          <div className="flex flex-col items-center text-center">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-lg font-black text-white shadow-lg`}>
              {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
            </div>
            
            <h3 className="font-bold text-zinc-100 mt-3">{currentUser.name || 'User'}</h3>
            <span className="text-xs text-zinc-500 font-mono tracking-tight">{currentUser.email}</span>
            
            <div className="mt-4 px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-[10px] font-mono tracking-wider text-indigo-400 uppercase font-bold">
              Role: {currentUser.role}
            </div>
          </div>
        </div>

        {/* Right column: premium subscription cards */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-6 backdrop-blur">
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            Configure Subscription Tier <CreditCard className="w-4 h-4 text-indigo-400" />
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Switch your active plan in a simulated container workspace. Upgrading instantly triggers high-volume token access and exposes the executive career coaching dashboard.
          </p>

          <div className="grid grid-cols-1 gap-4 mt-6">
            <div 
              onClick={() => handleUpdateSubscription('free')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                activePlan === 'free' 
                  ? 'bg-zinc-800/80 border-indigo-500/20 font-bold' 
                  : 'bg-zinc-900/15 border-zinc-800/80 hover:bg-zinc-900/35'
              }`}
            >
              <div className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="plan" 
                  checked={activePlan === 'free'}
                  readOnly 
                  className="accent-indigo-500"
                />
                <div className="text-xs">
                  <div className="font-semibold text-white">Free Sandbox Plan</div>
                  <span className="text-zinc-550 text-[10px] block text-zinc-500">Includes basic analysis matching and 1 interview session.</span>
                </div>
              </div>
              <span className="font-mono text-xs font-black text-zinc-400">$0</span>
            </div>

            <div 
              onClick={() => handleUpdateSubscription('pro')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center relative overflow-hidden ${
                activePlan === 'pro' 
                  ? 'bg-indigo-500/5 border-indigo-500/50 font-bold' 
                  : 'bg-zinc-900/15 border-zinc-800/80 hover:bg-zinc-900/35'
              }`}
            >
              <div className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="plan" 
                  checked={activePlan === 'pro'}
                  readOnly 
                  className="accent-indigo-500"
                />
                <div className="text-xs">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    Pro Career Architect <Zap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  </div>
                  <span className="text-zinc-400 text-[10px] block">Unlocks PDF analyzer uploads, detailed chronological roadmaps and portfolio ideas.</span>
                </div>
              </div>
              <span className="font-mono text-xs font-black text-indigo-400">$19/mo</span>
            </div>

            <div 
              onClick={() => handleUpdateSubscription('enterprise')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                activePlan === 'enterprise' 
                  ? 'bg-purple-500/5 border-purple-500/40 font-bold' 
                  : 'bg-zinc-900/15 border-zinc-800/80 hover:bg-zinc-900/35'
              }`}
            >
              <div className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="plan" 
                  checked={activePlan === 'enterprise'}
                  readOnly 
                  className="accent-indigo-550"
                />
                <div className="text-xs">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    Enterprise Institutional <Award className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <span className="text-zinc-400 text-[10px] block font-normal">Grants admin diagnostics tabs and bulk credentials parsing.</span>
                </div>
              </div>
              <span className="font-mono text-xs font-black text-purple-400">$49/mo</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
