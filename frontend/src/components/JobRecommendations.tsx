interface Props {
    items?: string[];
  }
  
  export function JobRecommendations({ items }: Props) {
    if (!items?.length) {
      return <p className="text-sm text-zinc-500">No JD-specific suggestions.</p>;
    }
  
    return (
      <ul className="space-y-2 text-sm">
        {items.map((rec, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    );
  }
  