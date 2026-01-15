interface Props {
    skills?: string[];
  }
  
  export function MatchedSkills({ skills }: Props) {
    if (!skills?.length) {
      return <p className="text-sm text-zinc-500">No matched skills.</p>;
    }
  
    return (
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
          >
            {skill}
          </span>
        ))}
      </div>
    );
  }
  