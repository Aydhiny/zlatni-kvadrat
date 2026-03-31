import { useState } from 'react'
import { Calculator } from 'lucide-react'

interface Props {
  defaultPrice?: number
  currency?: string
}

function calcMonthly(price: number, downPct: number, annualRate: number, years: number): number {
  const principal = price * (1 - downPct / 100)
  const r = annualRate / 100 / 12
  const n = years * 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

const BRAND = '#b5472a'

export function MortgageCalculator({ defaultPrice = 200_000, currency = 'EUR' }: Props) {
  const [down, setDown] = useState(20)
  const [rate, setRate] = useState(5.5)
  const [years, setYears] = useState(25)

  const monthly = calcMonthly(defaultPrice, down, rate, years)
  const fmt = (n: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-4 h-4" style={{ color: BRAND }} />
        <span className="text-sm font-semibold text-foreground">Mortgage Calculator</span>
      </div>

      <div className="space-y-4">
        {/* Down payment */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted">Down Payment</span>
            <span className="font-medium text-foreground">
              {down}% &nbsp;·&nbsp; {fmt((defaultPrice * down) / 100)}
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={60}
            value={down}
            onChange={(e) => setDown(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: BRAND }}
          />
        </div>

        {/* Interest rate */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted">Interest Rate</span>
            <span className="font-medium text-foreground">{rate.toFixed(1)}% p.a.</span>
          </div>
          <input
            type="range"
            min={1}
            max={15}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: BRAND }}
          />
        </div>

        {/* Loan term */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted">Loan Term</span>
            <span className="font-medium text-foreground">{years} years</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: BRAND }}
          />
        </div>
      </div>

      {/* Result */}
      <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: '#f3ede4' }}>
        <p className="text-xs text-muted mb-1">Estimated monthly payment</p>
        <p className="font-serif text-2xl text-foreground">
          {fmt(monthly)}
          <span className="text-sm font-sans text-muted"> /mo</span>
        </p>
        <p className="text-[11px] text-muted mt-1.5 leading-relaxed">
          Indicative only — consult your bank for exact terms.
        </p>
      </div>
    </div>
  )
}
