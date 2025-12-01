import { useState } from "react";

interface BodySilhouetteProps {
  contributors: Array<{ feature: string; importance: number }>;
}

type Region =
  | "head"
  | "heart"
  | "chest"
  | "abdomen"
  | "muscles"
  | "legs";

type Severity = "none" | "low" | "medium" | "high";

const regionMeta: Record<Region, { label: string; description: string }> = {
  head: {
    label: "Head / Brain",
    description: "Headaches, cognitive and neurological symptoms.",
  },
  heart: {
    label: "Heart",
    description: "Cardiac rhythm, pulse, and circulation‑related symptoms.",
  },
  chest: {
    label: "Chest / Lungs",
    description: "Breathing, cough, and lung‑related findings.",
  },
  abdomen: {
    label: "Abdomen / Digestive",
    description: "Stomach, liver, gut, and other digestive symptoms.",
  },
  muscles: {
    label: "Muscles / Arms",
    description: "Muscle strength, fatigue, and myalgia.",
  },
  legs: {
    label: "Legs / Lower Limbs",
    description: "Leg weakness, circulation, and gait‑related symptoms.",
  },
};

const keywordToRegion: { keywords: string[]; region: Region }[] = [
  { keywords: ["brain", "headache", "neuro", "mental"], region: "head" },
  { keywords: ["heart", "cardio", "pulse", "tachy", "palpitation"], region: "heart" },
  { keywords: ["lung", "resp", "cough", "breath", "dyspnea"], region: "chest" },
  { keywords: ["stomach", "abdomen", "abdominal", "nausea", "vomit", "gi "], region: "abdomen" },
  { keywords: ["muscle", "weakness", "fatigue", "myalgia"], region: "muscles" },
  { keywords: ["leg", "foot", "feet", "knee"], region: "legs" },
];

const getRegionSeverities = (
  contributors: BodySilhouetteProps["contributors"]
): Record<Region, Severity> => {
  const scores: Record<Region, number> = {
    head: 0,
    heart: 0,
    chest: 0,
    abdomen: 0,
    muscles: 0,
    legs: 0,
  };

  contributors.forEach((c) => {
    const feature = c.feature.toLowerCase();
    keywordToRegion.forEach(({ keywords, region }) => {
      if (keywords.some((k) => feature.includes(k))) {
        // Use max importance per region
        scores[region] = Math.max(scores[region], c.importance);
      }
    });
  });

  // If no region matched, softly highlight chest as neutral
  const allZero = Object.values(scores).every((v) => v === 0);
  if (allZero) {
    scores.chest = 5;
  }

  const toSeverity = (value: number): Severity => {
    if (value >= 30) return "high";
    if (value >= 15) return "medium";
    if (value > 0) return "low";
    return "none";
  };

  return {
    head: toSeverity(scores.head),
    heart: toSeverity(scores.heart),
    chest: toSeverity(scores.chest),
    abdomen: toSeverity(scores.abdomen),
    muscles: toSeverity(scores.muscles),
    legs: toSeverity(scores.legs),
  };
};

export const BodySilhouette = ({ contributors }: BodySilhouetteProps) => {
  const severities = getRegionSeverities(contributors);
  const [hoverRegion, setHoverRegion] = useState<Region | null>(null);

  const regionClass = (region: Region) => {
    const severity = severities[region];
    const base = ["silhouette-region", "cursor-pointer"];

    if (severity === "high") base.push("silhouette-region-high");
    else if (severity === "medium") base.push("silhouette-region-medium");
    else if (severity === "low") base.push("silhouette-region-low");
    else base.push("silhouette-region-none");

    if (hoverRegion === region) base.push("silhouette-region-hover");

    return base.join(" ");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        Affected Body Regions (Top 10 Symptoms)
      </p>
      <svg
        viewBox="0 0 120 260"
        className="w-32 md:w-40 lg:w-48 silhouette-base"
      >
        {/* Human-like outline built from simple shapes (head, neck, torso, arms, legs) */}
        {/* Head */}
        <circle
          cx="60"
          cy="30"
          r="14"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          className="opacity-70"
        />
        {/* Neck */}
        <rect
          x="54"
          y="42"
          width="12"
          height="6"
          rx="3"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          className="opacity-70"
        />
        {/* Torso */}
        <rect
          x="42"
          y="48"
          width="36"
          height="52"
          rx="10"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          className="opacity-70"
        />
        {/* Hips / pelvis */}
        <rect
          x="46"
          y="100"
          width="28"
          height="20"
          rx="8"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          className="opacity-70"
        />
        {/* Arms */}
        <rect
          x="30"
          y="52"
          width="10"
          height="42"
          rx="6"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          className="opacity-70"
        />
        <rect
          x="80"
          y="52"
          width="10"
          height="42"
          rx="6"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          className="opacity-70"
        />
        {/* Legs */}
        <rect
          x="50"
          y="120"
          width="10"
          height="52"
          rx="6"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          className="opacity-70"
        />
        <rect
          x="60"
          y="120"
          width="10"
          height="52"
          rx="6"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          className="opacity-70"
        />

        {/* Head / brain region */}
        <circle
          cx="60"
          cy="30"
          r="10"
          className={regionClass("head")}
          onMouseEnter={() => setHoverRegion("head")}
          onMouseLeave={() => setHoverRegion(null)}
        />

        {/* Heart */}
        <path
          d="M60 72c-3-4-8-5-11-2-3 3-3 8 0 11l11 11 11-11c3-3 3-8 0-11-3-3-8-2-11 2z"
          className={`${regionClass("heart")} heart-beat`}
          onMouseEnter={() => setHoverRegion("heart")}
          onMouseLeave={() => setHoverRegion(null)}
        />

        {/* Chest / lungs */}
        <rect
          x="46"
          y="56"
          width="28"
          height="30"
          rx="6"
          className={regionClass("chest")}
          onMouseEnter={() => setHoverRegion("chest")}
          onMouseLeave={() => setHoverRegion(null)}
        />

        {/* Abdomen */}
        <rect
          x="48"
          y="88"
          width="24"
          height="26"
          rx="6"
          className={regionClass("abdomen")}
          onMouseEnter={() => setHoverRegion("abdomen")}
          onMouseLeave={() => setHoverRegion(null)}
        />

        {/* Upper muscles / arms */}
        <rect
          x="32"
          y="65"
          width="12"
          height="40"
          rx="6"
          className={regionClass("muscles")}
          onMouseEnter={() => setHoverRegion("muscles")}
          onMouseLeave={() => setHoverRegion(null)}
        />
        <rect
          x="76"
          y="65"
          width="12"
          height="40"
          rx="6"
          className={regionClass("muscles")}
          onMouseEnter={() => setHoverRegion("muscles")}
          onMouseLeave={() => setHoverRegion(null)}
        />

        {/* Legs */}
        <rect
          x="50"
          y="130"
          width="8"
          height="44"
          rx="4"
          className={regionClass("legs")}
          onMouseEnter={() => setHoverRegion("legs")}
          onMouseLeave={() => setHoverRegion(null)}
        />
        <rect
          x="62"
          y="130"
          width="8"
          height="44"
          rx="4"
          className={regionClass("legs")}
          onMouseEnter={() => setHoverRegion("legs")}
          onMouseLeave={() => setHoverRegion(null)}
        />
      </svg>

      <div className="text-xs text-center text-muted-foreground max-w-[14rem] mt-1">
        {hoverRegion ? (
          <>
            <span className="font-semibold text-foreground">
              {regionMeta[hoverRegion].label}
            </span>
            <span>{": "}{regionMeta[hoverRegion].description}</span>
          </>
        ) : (
          <span>
            Hover over a body area. Red = highly affected, orange = affected,
            yellow = mildly affected.
          </span>
        )}
      </div>
    </div>
  );
}


