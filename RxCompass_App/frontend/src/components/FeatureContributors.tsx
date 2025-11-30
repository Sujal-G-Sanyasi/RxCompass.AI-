import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface FeatureContributorsProps {
  contributors: Array<{ feature: string; importance: number }>;
  patientId: number;
}

export const FeatureContributors = ({ contributors, patientId }: FeatureContributorsProps) => {
  const colors = [
    "hsl(217, 91%, 60%)",
    "hsl(262, 83%, 58%)",
    "hsl(142, 76%, 45%)",
    "hsl(217, 91%, 50%)",
    "hsl(262, 83%, 48%)",
    "hsl(142, 76%, 35%)",
    "hsl(217, 91%, 40%)",
    "hsl(262, 83%, 38%)",
    "hsl(142, 76%, 25%)",
    "hsl(217, 91%, 30%)",
  ];

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Top 10 Feature Contributors - Patient {patientId}</CardTitle>
        <CardDescription>
          Most influential features in the prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={contributors} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="feature" type="category" width={120} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar dataKey="importance" radius={[0, 8, 8, 0]}>
              {contributors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
