import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot, Legend } from "recharts";
import { TrendingUp, Activity } from "lucide-react";

interface FeatureContributorsProps {
  contributors: Array<{ feature: string; importance: number }>;
  patientId: number;
}

// Format feature names to be more readable
const formatFeatureName = (feature: string): string => {
  return feature
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Generate gradient colors based on importance (higher = more vibrant)
const getColorForIndex = (index: number, importance: number): string => {
  const baseColors = [
    "hsl(217, 91%, 60%)",  // Blue
    "hsl(262, 83%, 58%)",  // Purple
    "hsl(142, 76%, 45%)",  // Green
    "hsl(217, 91%, 50%)",  // Darker Blue
    "hsl(262, 83%, 48%)",  // Darker Purple
    "hsl(142, 76%, 35%)",  // Darker Green
    "hsl(217, 91%, 40%)",  // Even Darker Blue
    "hsl(262, 83%, 38%)",  // Even Darker Purple
    "hsl(142, 76%, 25%)",  // Even Darker Green
    "hsl(217, 91%, 30%)",  // Darkest Blue
  ];
  
  // Use importance to adjust saturation for visual emphasis
  const baseColor = baseColors[index % baseColors.length];
  const importanceFactor = Math.min(importance / 10, 1); // Normalize to 0-1
  const saturationBoost = 20 * importanceFactor;
  
  return baseColor;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-foreground mb-2">
          Rank #{data.rank}: {formatFeatureName(data.feature)}
        </p>
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getColorForIndex(data.rank - 1, data.importance) }}
          />
          <p className="text-sm text-muted-foreground">
            Contribution: <span className="font-bold text-primary text-base">{data.importance.toFixed(2)}%</span>
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
          {data.rank === 1 && "🏆 Most influential symptom"}
          {data.rank === 2 && "🥈 Second most influential"}
          {data.rank === 3 && "🥉 Third most influential"}
          {data.rank > 3 && `Ranked #${data.rank} of 10 symptoms`}
        </p>
      </div>
    );
  }
  return null;
};

export const FeatureContributors = ({ contributors, patientId }: FeatureContributorsProps) => {
  // Add rank to each contributor and format feature names
  const dataWithRank = contributors.map((contributor, index) => ({
    ...contributor,
    rank: index + 1,
    formattedFeature: formatFeatureName(contributor.feature),
  }));

  // Calculate total contribution for context
  const totalContribution = contributors.reduce((sum, c) => sum + c.importance, 0);
  const top3Contribution = contributors.slice(0, 3).reduce((sum, c) => sum + c.importance, 0);

  return (
    <Card className="mt-4 border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Top 10 Symptom Contributors</CardTitle>
              <CardDescription className="mt-1">
                Patient {patientId} - Symptoms that most influenced this prediction
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Top 3: {top3Contribution.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <ResponsiveContainer width="100%" height={400}>
            <LineChart 
              data={dataWithRank} 
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="rank"
                type="number"
                scale="linear"
                domain={[0.5, 10.5]}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                label={{ value: 'Rank (1 = Most Important)', position: 'insideBottom', offset: -10, fill: 'hsl(var(--muted-foreground))' }}
                ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                label={{ value: 'Contribution (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                domain={[0, 'dataMax + 2']}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '5 5' }}
              />
              <Line 
                type="monotone" 
                dataKey="importance" 
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={({ cx, cy, payload, index }) => {
                  const color = getColorForIndex(index, payload.importance);
                  return (
                    <Dot 
                      cx={cx} 
                      cy={cy} 
                      r={index < 3 ? 6 : 4}
                      fill={color}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ r: 8, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                isAnimationActive={true}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
          
          {/* Feature Labels */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4 pt-4 border-t">
            {dataWithRank.map((entry, index) => (
              <div 
                key={index}
                className={`p-2 rounded-lg text-xs ${
                  index < 3 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'bg-muted/50 border border-border'
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getColorForIndex(index, entry.importance) }}
                  />
                  <span className="font-semibold text-foreground">#{entry.rank}</span>
                </div>
                <div className="text-muted-foreground font-medium">
                  {entry.formattedFeature}
                </div>
                <div className="text-primary font-bold mt-1">
                  {entry.importance.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{contributors[0]?.importance.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground mt-1">Top Contributor</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{top3Contribution.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground mt-1">Top 3 Combined</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalContribution.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground mt-1">Total Contribution</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
