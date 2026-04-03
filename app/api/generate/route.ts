import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY || "",
  baseURL: process.env.OPENAI_API_KEY ? undefined : "https://api.deepseek.com/v1",
});

const SYSTEM_PROMPT = `You are an expert real estate investment analyst and financial modeler. Generate a comprehensive real estate investment property analysis with cash flow projections and risk assessment. Output in clean markdown format.

Include ALL of the following sections:

## 📈 Key Investment Metrics
Calculate and present:
- **Cap Rate**: Net Operating Income / Property Price (explain what this means)
- **Cash-on-Cash Return**: Annual Pre-Tax Cash Flow / Total Cash Invested
- **IRR Estimate**: Internal Rate of Return for a 5-year hold (explain methodology)
Present these with context — how they compare to market norms for the property type and city.

## 💵 Monthly Cash Flow Projection
Provide a detailed monthly cash flow breakdown:
- Gross Rental Income
- Operating Expenses (property tax, insurance, management, maintenance reserve, utilities, HOA, vacancy reserve)
- Mortgage Payment (P&I)
- Net Monthly Cash Flow
Explain each line item and note industry-standard percentages.

## 📊 Vacancy Rate Analysis
Provide a realistic vacancy rate recommendation for the market and property type. Include:
- Market vacancy rate context
- Recommended vacancy allowance (as % of gross rent)
- Seasonality notes if relevant

## 🏦 Expense Breakdown
Provide a percentage and dollar breakdown of all operating expenses. Compare to the "1% rule" and "50% rule" for context. Note which expenses are fixed vs. variable.

## 📅 5-Year Pro Forma
Create a simple 5-year projection with columns for each year showing:
- Gross rental income (with growth rate assumption)
- Operating expenses (with inflation)
- Net Operating Income (NOI)
- Debt service
- Cash flow after debt service
- Cumulative cash flow
- Property value estimate (with appreciation assumption)
Note your assumptions for rent growth, appreciation, and expense inflation.

## 📈 Appreciation Projection
Provide a conservative/moderate/optimistic appreciation scenario. Explain the market factors that drive appreciation in the specific city/region. Note any supply/demand dynamics.

## ⚠️ Investment Risks
Identify 5-7 specific risks for this investment:
- Market/宏观 risk
- Interest rate risk (especially for ARM loans)
- Tenant risk
- Liquidity risk
- Regulatory/legal risk
- Maintenance/capex risk
- Refinancing risk
For each risk, provide a mitigation strategy.`;

export async function POST(req: NextRequest) {
  try {
    const { propertyPrice, downPayment, expectedRent, propertyType, marketCity, propertyCondition, renovationCosts, loanTerms, managementApproach } = await req.json();

    const userPrompt = `Generate a real estate investment analysis:

- **Property Price**: $${propertyPrice || "Not specified"}
- **Down Payment**: ${downPayment}%
- **Expected Monthly Rent**: $${expectedRent || "Not specified"}
- **Property Type**: ${propertyType}
- **Market City**: ${marketCity || "Not specified"}
- **Property Condition**: ${propertyCondition}
- **Renovation Costs**: $${renovationCosts || "0"}
- **Loan Type**: ${loanTerms}
- **Management**: ${managementApproach}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_API_KEY ? "gpt-4o" : "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const output = completion.choices[0]?.message?.content || "No output generated.";
    return NextResponse.json({ output });
  } catch (err: any) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: err.message || "Generation failed" }, { status: 500 });
  }
}
