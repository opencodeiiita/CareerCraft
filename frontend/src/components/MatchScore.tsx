interface Props {
    value?: number;
  }
  
  export function MatchScore({ value }: Props) {
    if (value === undefined) {
      return <p className="text-sm text-zinc-500">Match score not available.</p>;
    }
  
    const clamped = Math.max(0, Math.min(100, value));
  
    return (
      <div>
        <div className="mb-2 flex justify-between text-sm text-zinc-600 dark:text-zinc-300">
          <span>Job Match</span>
          <span className="font-semibold text-zinc-900 dark:text-white">
            {clamped}%
          </span>
        </div>
  
        <div className="h-3 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all"
            style={{ width: `${clamped}%` }}
          />
        </div>
      </div>
    );
  }
  