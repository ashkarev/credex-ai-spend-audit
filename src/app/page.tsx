'use client';

import { useState } from 'react';
import AuditForm from '@/components/AuditForm';
import { AuditInput, AuditResult } from '@/lib/types';
import { calculateAudit } from '@/lib/auditEngine';

export default function Home() {
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleAuditSubmit = async (input: AuditInput) => {
    // For Day 1: just calculate locally
    const audit = calculateAudit(input);
    setResult(audit);
  };

  if (result) {
    return <AuditResultsPage result={result} />;
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4 text-black">AI Spend Audit</h1>
        <p className="text-lg text-gray-600 mb-8">
          See how much you could save on AI tools. No sign-up required.
        </p>
        <AuditForm onSubmit={handleAuditSubmit} />
      </section>
    </main>
  );
}

function AuditResultsPage({ result }: { result: AuditResult }) {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4 text-black">Your Audit Results</h1>
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xl font-semibold text-green-800">Total Monthly Savings: ${result.totalMonthlySavings}</p>
          <p className="text-lg text-green-700">Total Annual Savings: ${result.totalAnnualSavings}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-black">Recommendations</h2>
          {result.recommendations.map((rec, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <h3 className="font-bold text-lg">{rec.toolId}</h3>
              <p className="text-blue-600 font-medium">{rec.recommendation} (Saves ${rec.savingsPerMonth}/mo)</p>
              <p className="text-gray-600 mt-2">{rec.reasoning}</p>
            </div>
          ))}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Start Over
        </button>
      </section>
    </main>
  );
}
