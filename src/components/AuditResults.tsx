import { AuditResult } from '@/lib/types';
import { PRICING_DATA } from '@/lib/pricing';

export default function AuditResults({ result }: { result: AuditResult }) {
  const hasRecommendations = result.recommendations.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Metrics */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center shadow-sm">
        <h2 className="text-xl font-medium text-green-800 mb-2">Potential Savings Identified</h2>
        <div className="text-5xl font-bold text-green-600 mb-4">${result.totalMonthlySavings.toLocaleString()}<span className="text-2xl text-green-700/70 font-medium">/mo</span></div>
        <p className="text-green-700 font-medium">That&apos;s ${result.totalAnnualSavings.toLocaleString()} per year!</p>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 border-b pb-2">Action Plan</h3>
        
        {!hasRecommendations ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <p className="text-gray-600 text-lg">Your AI tool stack looks highly optimized! We didn&apos;t find any clear areas for cost reduction based on public pricing.</p>
          </div>
        ) : (
          result.recommendations.map((rec, idx) => {
            const toolName = rec.toolId === 'cross-tool' ? 'Tool Consolidation' : (PRICING_DATA[rec.toolId]?.name || rec.toolId);
            
            return (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{toolName}</h4>
                    <p className="text-gray-500 text-sm mb-3">
                      Current: {rec.currentPlan.charAt(0).toUpperCase() + rec.currentPlan.slice(1)} (${rec.currentSpend}/mo)
                    </p>
                    <p className="text-gray-800 leading-relaxed">{rec.reasoning}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 min-w-[200px] text-center shrink-0">
                    <p className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-1">Recommendation</p>
                    <p className="text-md font-bold text-blue-900 mb-2">{rec.recommendation}</p>
                    <div className="inline-block bg-white px-3 py-1 rounded-full text-sm font-bold text-green-600 border border-green-200 shadow-sm">
                      Saves ${rec.savingsPerMonth}/mo
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Start Over Action */}
      <div className="pt-4 flex justify-center">
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-colors"
        >
          ← Run Another Audit
        </button>
      </div>
    </div>
  );
}
