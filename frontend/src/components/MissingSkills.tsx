interface Props {
    skills?: string[];
  }
  
  export function MissingSkills({ skills }: Props) {
    if (!skills?.length) {
      return <p className="text-sm text-zinc-500">No missing skills 🎉</p>;
    }
  
    return (
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
          >
            {skill}
          </span>
        ))}
      </div>
    );
  }
  