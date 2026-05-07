'use client';

import { useState, useEffect } from 'react';
import { AuditInput } from '@/lib/types';

export default function AuditForm({ onSubmit }: { onSubmit: (data: AuditInput) => void }) {
  const [formData, setFormData] = useState<AuditInput>(() => {
    // Persist form state to localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('auditFormData');
      return saved ? JSON.parse(saved) : getDefaultForm();
    }
    return getDefaultForm();
  });

  // Auto-save to localStorage on change
  useEffect(() => {
    localStorage.setItem('auditFormData', JSON.stringify(formData));
  }, [formData]);

  const handleAddTool = () => {
    setFormData(prev => ({
      ...prev,
      tools: [...prev.tools, { toolId: '', plan: '', monthlySpend: 0, seats: 1 }],
    }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      {/* Team Size & Use Case */}
      <input
        type="number"
        placeholder="Team size"
        value={formData.teamSize}
        onChange={(e) => setFormData(prev => ({ ...prev, teamSize: parseInt(e.target.value) }))}
      />

      <select
        value={formData.primaryUseCase}
        onChange={(e) => setFormData(prev => ({ ...prev, primaryUseCase: e.target.value as any }))}
      >
        <option value="coding">Coding</option>
        <option value="writing">Writing</option>
        <option value="data">Data</option>
        <option value="research">Research</option>
        <option value="mixed">Mixed</option>
      </select>

      {/* Tools */}
      {formData.tools.map((tool, idx) => (
        <div key={idx}>
          <select
            value={tool.toolId}
            onChange={(e) => {
              const newTools = [...formData.tools];
              newTools[idx].toolId = e.target.value;
              setFormData(prev => ({ ...prev, tools: newTools }));
            }}
          >
            <option value="">Select a tool</option>
            <option value="cursor">Cursor</option>
            <option value="copilot">GitHub Copilot</option>
            <option value="claude">Claude</option>
            <option value="chatgpt">ChatGPT</option>
            {/* etc */}
          </select>

          <input
            type="number"
            placeholder="Monthly spend ($)"
            value={tool.monthlySpend}
            onChange={(e) => {
              const newTools = [...formData.tools];
              newTools[idx].monthlySpend = parseInt(e.target.value);
              setFormData(prev => ({ ...prev, tools: newTools }));
            }}
          />
        </div>
      ))}

      <button type="button" onClick={handleAddTool}>+ Add Tool</button>
      <button type="submit">Get Your Audit</button>
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
