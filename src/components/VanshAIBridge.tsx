type Variant = 'compact' | 'panel' | 'lost';

interface VanshAIBridgeProps {
  variant?: Variant;
  className?: string;
}

const COPY: Record<Variant, { title: string; body: string; cta: string }> = {
  compact: {
    title: 'Vansh AI Intelligence',
    body: 'Vansh CRM tracks pipeline velocity. Vansh AI Copilot analyzes why deals win or lose.',
    cta: 'Explore Vansh AI',
  },
  panel: {
    title: 'AI Conversation Insights',
    body: 'Vansh CRM analyzes pitch quality, objection handling, speaker ratios, and budget signals.',
    cta: 'Analyze Conversations',
  },
  lost: {
    title: 'Deal Loss Diagnostics',
    body: 'Discover why deals stalled — missed objections, pricing pushbacks, or timing conflicts.',
    cta: 'View Deal Insights',
  },
};

export function VanshAIBridge({ variant = 'compact', className = '' }: VanshAIBridgeProps) {
  const copy = COPY[variant];
  return (
    <aside
      className={`rounded-none border border-[var(--color-line)] bg-stone-50 p-4 ${className}`}
    >
      <p className="text-[11px] font-semibold tracking-[0.12em] text-teal-700 uppercase">
        Vansh Sales Copilot
      </p>
      <p className="mt-1 text-sm font-semibold text-stone-900">{copy.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-stone-600">{copy.body}</p>
      <span className="mt-3 inline-flex text-xs font-semibold text-teal-800">
        {copy.cta}
      </span>
    </aside>
  );
}
