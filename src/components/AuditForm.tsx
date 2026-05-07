'use client';

import { useState, useEffect } from 'react';
import { AuditInput } from '@/lib/types';
import { PRICING_DATA } from '@/lib/pricing';

export default function AuditForm({ onSubmit }: { onSubmit: (data: AuditInput) => void }) {
  const [formData, setFormData] = useState<AuditInput>(getDefaultForm());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('auditFormData');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse form data', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('auditFormData', JSON.stringify(formData));
    }
  }, [formData, isMounted]);

  const handleAddTool = () => {
    setFormData(prev => ({
      ...prev,
      tools: [...prev.tools, { toolId: '', plan: '', monthlySpend: 0, seats: 1 }],
    }));
  };

  const handleRemoveTool = (index: number) => {
    setFormData(prev => {
      const newTools = [...prev.tools];
      newTools.splice(index, 1);
      return { ...prev, tools: newTools };
    });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-8">
      {/* Team Info */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
            <input
              type="number"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              value={Number.isNaN(formData.teamSize) ? '' : formData.teamSize}
              onChange={(e) => setFormData(prev => ({ ...prev, teamSize: parseInt(e.target.value, 10) || 0 }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Use Case</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              value={formData.primaryUseCase}
              onChange={(e) => setFormData(prev => ({ ...prev, primaryUseCase: e.target.value as AuditInput['primaryUseCase'] }))}
            >
              <option value="coding">Coding</option>
              <option value="writing">Writing</option>
              <option value="data">Data</option>
              <option value="research">Research</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Your Tools</h2>
          <button 
            type="button" 
            onClick={handleAddTool}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full transition-colors"
          >
            + Add Tool
          </button>
        </div>

        {formData.tools.map((tool, idx) => {
          const selectedToolPricing = tool.toolId ? PRICING_DATA[tool.toolId] : null;
          return (
            <div key={idx} className="bg-gray-50 p-5 rounded-xl border border-gray-200 relative">
              <button 
                type="button" 
                onClick={() => handleRemoveTool(idx)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove tool"
              >
                ✕
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tool</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    value={tool.toolId}
                    onChange={(e) => {
                      const newTools = [...formData.tools];
                      newTools[idx].toolId = e.target.value;
                      newTools[idx].plan = ''; // reset plan when tool changes
                      setFormData(prev => ({ ...prev, tools: newTools }));
                    }}
                    required
                  >
                    <option value="">Select a tool...</option>
                    {Object.entries(PRICING_DATA).map(([id, data]) => (
                      <option key={id} value={id}>{data.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                    value={tool.plan}
                    onChange={(e) => {
                      const newTools = [...formData.tools];
                      newTools[idx].plan = e.target.value;
                      setFormData(prev => ({ ...prev, tools: newTools }));
                    }}
                    disabled={!tool.toolId}
                    required
                  >
                    <option value="">Select plan...</option>
                    {selectedToolPricing && Object.entries(selectedToolPricing.plans).map(([planId, planData]) => (
                      <option key={planId} value={planId}>
                        {planId.charAt(0).toUpperCase() + planId.slice(1)} ({planData.description})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Seats</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    value={Number.isNaN(tool.seats) ? '' : tool.seats}
                    onChange={(e) => {
                      const newTools = [...formData.tools];
                      newTools[idx].seats = parseInt(e.target.value, 10) || 1;
                      setFormData(prev => ({ ...prev, tools: newTools }));
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Spend ($)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    value={Number.isNaN(tool.monthlySpend) ? '' : tool.monthlySpend}
                    onChange={(e) => {
                      const newTools = [...formData.tools];
                      newTools[idx].monthlySpend = parseInt(e.target.value, 10) || 0;
                      setFormData(prev => ({ ...prev, tools: newTools }));
                    }}
                    placeholder="Actual amount you pay"
                    required
                  />
                </div>
              </div>
            </div>
          );
        })}

        {formData.tools.length === 0 && (
          <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-500 mb-2">No tools added yet.</p>
            <button 
              type="button" 
              onClick={handleAddTool}
              className="text-blue-600 font-medium hover:underline"
            >
              Add your first tool
            </button>
          </div>
        )}
      </div>

      <button 
        type="submit"
        className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={formData.tools.length === 0}
      >
        Get Your Audit
      </button>
    </form>
  );
}

function getDefaultForm(): AuditInput {
  return {
    tools: [],
    teamSize: 1,
    primaryUseCase: 'coding',
    email: '',
  };
}
