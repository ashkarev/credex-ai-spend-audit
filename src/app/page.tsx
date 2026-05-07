'use client';

import { useState } from 'react';
import AuditForm from '@/components/AuditForm';
import AuditResults from '@/components/AuditResults';
import { AuditInput, AuditResult } from '@/lib/types';
import { calculateAudit } from '@/lib/auditEngine';

export default function Home() {
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleAuditSubmit = async (input: AuditInput) => {
    // For Day 1: just calculate locally
    const audit = calculateAudit(input);
    setResult(audit);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">AI Spend Audit</h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
            See how much you could save on AI tools. No sign-up required.
          </p>
        </div>

        {result ? (
          <AuditResults result={result} />
        ) : (
          <AuditForm onSubmit={handleAuditSubmit} />
        )}
      </div>
    </main>
  );
}
