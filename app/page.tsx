"use client";
import { useState } from "react";

const ACCENT_TEXT = "text-violet-400";
const ACCENT_BG = "bg-violet-500";
const ACCENT_BG_HOVER = "hover:bg-violet-600";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>{children}</div>;
}
function Select({ id, children, value, onChange }: { id: string; children: React.ReactNode; value: string; onChange: (v: string) => void }) {
  return <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500">{children}</select>;
}
function Input({ id, value, onChange, placeholder }: { id: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500" />;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const [propertyPrice, setPropertyPrice] = useState("");
  const [downPayment, setDownPayment] = useState("20");
  const [expectedRent, setExpectedRent] = useState("");
  const [propertyType, setPropertyType] = useState("single family");
  const [marketCity, setMarketCity] = useState("");
  const [propertyCondition, setPropertyCondition] = useState("good");
  const [renovationCosts, setRenovationCosts] = useState("0");
  const [loanTerms, setLoanTerms] = useState("30-year-fixed");
  const [managementApproach, setManagementApproach] = useState("self-managed");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setOutput(""); setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyPrice, downPayment, expectedRent, propertyType, marketCity, propertyCondition, renovationCosts, loanTerms, managementApproach }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOutput(data.output);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">📊 AI Real Estate Investment Property Analysis</h1>
          <p className="text-gray-400 text-sm">Generate real estate investment analyses with cash flow projections</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
            <h2 className={`text-lg font-semibold ${ACCENT_TEXT} border-b border-gray-800 pb-2`}>Investment Property Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Property Price ($)"><Input id="propertyPrice" value={propertyPrice} onChange={setPropertyPrice} placeholder="e.g. 425000" /></Field>
              <Field label="Down Payment (%)">
                <Select id="downPayment" value={downPayment} onChange={setDownPayment}>
                  <option value="5">5%</option><option value="10">10%</option>
                  <option value="15">15%</option><option value="20">20%</option>
                  <option value="25">25%</option><option value="30">30%</option>
                  <option value="35">35%</option><option value="40">40%</option>
                  <option value="50">50% (Cash)</option>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Expected Monthly Rent ($)"><Input id="expectedRent" value={expectedRent} onChange={setExpectedRent} placeholder="e.g. 2800" /></Field>
              <Field label="Property Type">
                <Select id="propertyType" value={propertyType} onChange={setPropertyType}>
                  <option value="single family">Single Family</option>
                  <option value="duplex">Duplex/Triplex</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="apartment">Small Apartment (5-20 units)</option>
                  <option value="commercial">Commercial</option>
                </Select>
              </Field>
            </div>

            <Field label="Market City/Region"><Input id="marketCity" value={marketCity} onChange={setMarketCity} placeholder="e.g. Phoenix, AZ" /></Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Property Condition">
                <Select id="propertyCondition" value={propertyCondition} onChange={setPropertyCondition}>
                  <option value="excellent">Excellent (Move-in Ready)</option>
                  <option value="good">Good (Minor Updates Needed)</option>
                  <option value="fair">Fair (Moderate Renovation)</option>
                  <option value="poor">Poor (Major Renovation)</option>
                  <option value=" fixer">Fixer-Upper</option>
                </Select>
              </Field>
              <Field label="Renovation Costs ($)"><Input id="renovationCosts" value={renovationCosts} onChange={setRenovationCosts} placeholder="e.g. 15000" /></Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Loan Type">
                <Select id="loanTerms" value={loanTerms} onChange={setLoanTerms}>
                  <option value="30-year-fixed">30-Year Fixed</option>
                  <option value="15-year-fixed">15-Year Fixed</option>
                  <option value="ARM">ARM (5/1, 7/1)</option>
                  <option value="hard-money">Hard Money Loan</option>
                  <option value="cash">All Cash</option>
                </Select>
              </Field>
              <Field label="Management Approach">
                <Select id="managementApproach" value={managementApproach} onChange={setManagementApproach}>
                  <option value="self-managed">Self-Managed</option>
                  <option value="property manager">Property Manager</option>
                  <option value="hybrid">Hybrid (Self + PM)</option>
                </Select>
              </Field>
            </div>

            <button type="submit" disabled={loading}
              className={`w-full ${ACCENT_BG} ${ACCENT_BG_HOVER} text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}>
              {loading ? "Generating Analysis..." : "Generate Investment Analysis"}
            </button>
          </form>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className={`text-lg font-semibold ${ACCENT_TEXT} border-b border-gray-800 pb-2 mb-4`}>Generated Output</h2>
            {error && <div className="text-red-400 text-sm bg-red-950/30 border border-red-900/50 rounded-lg p-3">{error}</div>}
            {loading && <div className="flex items-center gap-3 text-gray-400 text-sm"><span className="animate-spin inline-block w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full"></span>Generating your investment analysis...</div>}
            {!loading && !output && !error && <p className="text-gray-500 text-sm italic">Your investment analysis will appear here.</p>}
            {output && <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed bg-gray-950/50 rounded-lg p-4 max-h-[600px] overflow-y-auto">{output}</pre>}
          </div>
        </div>
      </div>
    </div>
  );
}
