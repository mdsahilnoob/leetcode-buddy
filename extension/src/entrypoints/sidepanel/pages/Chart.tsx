import { CartesianGrid, Line, LineChart, XAxis, Customized } from "recharts";
import { useCallback, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowLeft } from "lucide-react";
import { profileAPI } from '@/services/api';

const chartConfig = {
  user1: {
    label: "User 1",
    color: "hsl(142, 71%, 45%)",
  },
  user2: {
    label: "User 2",
    color: "hsl(212, 92%, 55%)",
  },
} satisfies ChartConfig;

interface PartialLineChartProps {
  profile1: UserStats;
  profile2: UserStats;
}

export function PartialLineChart({ profile1, profile2 }: PartialLineChartProps) {
  const chartData = [
    { 
      difficulty: "Easy", 
      user1: profile1.easy, 
      user2: profile2.easy 
    },
    { 
      difficulty: "Medium", 
      user1: profile1.medium, 
      user2: profile2.medium 
    },
    { 
      difficulty: "Hard", 
      user1: profile1.hard, 
      user2: profile2.hard 
    },
    { 
      difficulty: "Total", 
      user1: profile1.solved, 
      user2: profile2.solved 
    },
  ];

  const [DasharrayCalculator, lineDasharrays] = useDynamicDasharray({
    splitIndex: chartData.length - 1,
  });

  return (
    <Card className="bg-[#161b22] border-[#30363d] shadow-lg">
      <CardHeader>
        <CardTitle className="text-white text-xl">
          Difficulty Comparison
          <Badge
            variant="outline"
            className="text-green-400 bg-green-500/10 border-green-500/30 ml-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Live Data</span>
          </Badge>
        </CardTitle>
        <CardDescription className="text-[#8b949e] text-base">Problems solved by difficulty</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-54 w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="difficulty"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {Object.entries(chartConfig).map(([key, value]) => (
              <Line
                key={key}
                dataKey={key}
                type="linear"
                stroke={value.color}
                dot={{
                  r: 2.5,
                  fill: value.color,
                }}
                strokeDasharray={
                  lineDasharrays.find((line) => line.name === key)
                    ?.strokeDasharray || "0 0"
                }
              />
            ))}
            <Customized component={DasharrayCalculator} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

interface ChartDataPoint {
  x?: number;
  y?: number;
  value?: number | string;
  payload?: Record<string, unknown>;
}

interface ChartLineData {
  item: {
    props: {
      dataKey: string;
    };
  };
  props: {
    points: ChartDataPoint[];
  };
}

interface CustomizedChartProps {
  formattedGraphicalItems?: ChartLineData[];
}

interface LineConfig {
  name: string;
  splitIndex?: number;
  dashPattern?: number[];
  curveAdjustment?: number;
}

interface UseDynamicDasharrayProps {
  lineConfigs?: LineConfig[];
  splitIndex?: number;
  defaultDashPattern?: number[];
  curveAdjustment?: number;
}

type LineDasharray = {
  name: string;
  strokeDasharray: string;
}[];

export function useDynamicDasharray({
  lineConfigs = [],
  splitIndex = -2,
  defaultDashPattern: dashPattern = [5, 3],
  curveAdjustment = 1,
}: UseDynamicDasharrayProps): [
  (props: CustomizedChartProps) => null,
  LineDasharray
] {
  const [lineDasharrays, setLineDasharrays] = useState<LineDasharray>([]);

  const DasharrayCalculator = useCallback(
    (props: CustomizedChartProps): null => {
      const chartLines = props?.formattedGraphicalItems;
      const newLineDasharrays: LineDasharray = [];

      const calculatePathLength = (points: ChartDataPoint[]) => {
        return (
          points?.reduce((acc, point, index) => {
            if (index === 0) return acc;

            const prevPoint = points[index - 1];

            const dx = (point.x || 0) - (prevPoint.x || 0);
            const dy = (point.y || 0) - (prevPoint.y || 0);

            acc += Math.sqrt(dx * dx + dy * dy);
            return acc;
          }, 0) || 0
        );
      };

      chartLines?.forEach((line) => {
        const points = line?.props?.points;
        const totalLength = calculatePathLength(points || []);

        const lineName = line?.item?.props?.dataKey;
        const lineConfig = lineConfigs?.find(
          (config) => config?.name === lineName
        );
        const lineSplitIndex = lineConfig?.splitIndex ?? splitIndex;
        const dashedSegment = points?.slice(lineSplitIndex);
        const dashedLength = calculatePathLength(dashedSegment || []);

        if (!totalLength || !dashedLength) return;

        const solidLength = totalLength - dashedLength;
        const curveCorrectionFactor =
          lineConfig?.curveAdjustment ?? curveAdjustment;
        const adjustment = (solidLength * curveCorrectionFactor) / 100;
        const solidDasharrayPart = solidLength + adjustment;

        const targetDashPattern = lineConfig?.dashPattern || dashPattern;
        const patternSegmentLength =
          (targetDashPattern?.[0] || 0) + (targetDashPattern?.[1] || 0) || 1;
        const repetitions = Math.ceil(dashedLength / patternSegmentLength);
        const dashedPatternSegments = Array.from({ length: repetitions }, () =>
          targetDashPattern.join(" ")
        );

        const finalDasharray = `${solidDasharrayPart} ${dashedPatternSegments.join(
          " "
        )}`;
        newLineDasharrays.push({
          name: lineName!,
          strokeDasharray: finalDasharray,
        });
      });

      if (
        JSON.stringify(newLineDasharrays) !== JSON.stringify(lineDasharrays)
      ) {
        setTimeout(() => setLineDasharrays(newLineDasharrays), 0);
      }

      return null;
    },
    [splitIndex, curveAdjustment, lineConfigs, dashPattern, lineDasharrays]
  );

  return [DasharrayCalculator, lineDasharrays];
}

interface ChartProps {
  user1: string;
  user2: string;
  onBack: () => void;
}

interface UserStats {
  username: string;
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  ranking: number;
}

export default function Chart({ user1, user2, onBack }: ChartProps) {
  const [profile1, setProfile1] = useState<UserStats | null>(null);
  const [profile2, setProfile2] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const [data1, data2] = await Promise.all([
          profileAPI.getProfile(user1),
          profileAPI.getProfile(user2)
        ]);
        setProfile1(data1);
        setProfile2(data2);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user1, user2]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#58a6ff] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-[#8b949e]">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (error || !profile1 || !profile2) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-400 mb-3 text-3xl">⚠️</div>
          <p className="text-sm text-red-400 mb-4">{error || 'Failed to load profiles'}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm bg-[#238636] hover:bg-[#2ea043] text-white rounded-md transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] overflow-y-auto p-3">
      <button
        onClick={onBack}
        className="mb-3 flex items-center gap-2 text-[#8b949e] hover:text-[#58a6ff] transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-white mb-1">
          {user1} vs {user2}
        </h2>
        <p className="text-xs text-[#8b949e]">LeetCode Profile Comparison</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
          <div className="mb-2">
            <div className="text-sm font-bold text-white mb-1">{profile1.username}</div>
            <div className="text-xs text-[#8b949e] bg-[#21262d] px-2 py-0.5 rounded inline-block">
              Rank #{profile1.ranking.toLocaleString()}
            </div>
          </div>
          <div className="text-3xl font-bold text-[#238636] mb-1">{profile1.solved}</div>
          <div className="text-xs text-[#8b949e] mb-3">problems solved</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3fb950]"></div>
                <span className="text-xs text-[#c9d1d9]">Easy</span>
              </div>
              <span className="text-sm font-bold text-[#3fb950]">{profile1.easy}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#d29922]"></div>
                <span className="text-xs text-[#c9d1d9]">Medium</span>
              </div>
              <span className="text-sm font-bold text-[#d29922]">{profile1.medium}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#f85149]"></div>
                <span className="text-xs text-[#c9d1d9]">Hard</span>
              </div>
              <span className="text-sm font-bold text-[#f85149]">{profile1.hard}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#30363d]">
            <div className="flex justify-between text-xs">
              <span className="text-[#8b949e]">Acceptance:</span>
              <span className="font-bold text-[#58a6ff]">
                {((profile1.solved / (profile1.easy + profile1.medium + profile1.hard)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
          <div className="mb-2">
            <div className="text-sm font-bold text-white mb-1">{profile2.username}</div>
            <div className="text-xs text-[#8b949e] bg-[#21262d] px-2 py-0.5 rounded inline-block">
              Rank #{profile2.ranking.toLocaleString()}
            </div>
          </div>
          <div className="text-3xl font-bold text-[#1f6feb] mb-1">{profile2.solved}</div>
          <div className="text-xs text-[#8b949e] mb-3">problems solved</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3fb950]"></div>
                <span className="text-xs text-[#c9d1d9]">Easy</span>
              </div>
              <span className="text-sm font-bold text-[#3fb950]">{profile2.easy}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#d29922]"></div>
                <span className="text-xs text-[#c9d1d9]">Medium</span>
              </div>
              <span className="text-sm font-bold text-[#d29922]">{profile2.medium}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#f85149]"></div>
                <span className="text-xs text-[#c9d1d9]">Hard</span>
              </div>
              <span className="text-sm font-bold text-[#f85149]">{profile2.hard}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#30363d]">
            <div className="flex justify-between text-xs">
              <span className="text-[#8b949e]">Acceptance:</span>
              <span className="font-bold text-[#58a6ff]">
                {((profile2.solved / (profile2.easy + profile2.medium + profile2.hard)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <PartialLineChart profile1={profile1} profile2={profile2} />
    </div>
  );
}
