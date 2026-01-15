import { MatchScore } from "./MatchScore";
import { MatchedSkills } from "./MatchedSkills";
import { MissingSkills } from "./MissingSkills";
import { JobRecommendations } from "./JobRecommendations";

interface Props {
  data?: {
    match_percentage?: number;
    matched_skills?: string[];
    missing_skills?: string[];
    recommendations?: string[];
  };
}

export function JobMatchCard({ data }: Props) {
  if (!data) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
          Job Match
        </p>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Resume ↔ Job Description Fit
        </h3>
      </div>

      <div className="space-y-6">
        <MatchScore value={data.match_percentage} />

        <div>
          <h4 className="mb-2 text-sm font-semibold">Matched Skills</h4>
          <MatchedSkills skills={data.matched_skills} />
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">Missing / Recommended Skills</h4>
          <MissingSkills skills={data.missing_skills} />
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">JD-Based Suggestions</h4>
          <JobRecommendations items={data.recommendations} />
        </div>
      </div>
    </div>
  );
}
