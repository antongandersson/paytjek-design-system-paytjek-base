import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

interface EarningsGaugeProps {
  earned?: number | null;
  total?: number | null;
  date?: string | null;
  isLoading?: boolean;
}

export function EarningsGauge({ 
  earned,
  total,
  date,
  isLoading = false
}: EarningsGaugeProps) {
  // Loading state
  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-4 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-36 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  // Empty state - no earnings data yet
  if (earned === undefined || earned === null || total === undefined || total === null) {
    return (
      <Card className="border-2 border-dashed border-border/50 bg-muted/10">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[180px]">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <TrendingUp className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground mb-1">
            Ingen indtjeningsdata
          </p>
          <p className="text-sm text-muted-foreground">
            Upload en lønseddel for at se din optjening
          </p>
        </CardContent>
      </Card>
    );
  }

  const percentage = (earned / total) * 100;
  
  // Data for semi-circle gauge
  const data = [
    { name: "earned", value: percentage },
    { name: "remaining", value: 100 - percentage },
  ];

  return (
    <Card className="border-border/50">
      <CardContent className="p-4 space-y-2">
        <p className="text-sm text-muted-foreground">
          Optjent til dato: {date || "i dag"}
        </p>
        
        <div className="relative h-40">
          {/* Chart */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="75%"
                startAngle={180}
                endAngle={0}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                <Cell fill="hsl(var(--primary))" />
                <Cell fill="hsl(var(--muted))" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Tekst placeret INDEN I buen (i centrum) */}
          <div className="absolute inset-x-0 bottom-4 flex flex-col items-center pointer-events-none">
            <p className="text-2xl font-bold text-primary">
              {earned.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-base font-medium text-muted-foreground">Kr</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Samlet hele måneden: {total.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kr
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
