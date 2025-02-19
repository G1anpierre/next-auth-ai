import React from "react";

import {
  Card,
  Button,
  Select,
  SelectItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  cn,
  ButtonProps,
  CardProps,
} from "@heroui/react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Label } from "recharts";
import { Icon } from "@iconify/react";
import { formatValue } from "@/utils/format-currency";

type ChartData = {
  name: string;
  [key: string]: string | number;
};

type CircleChartProps = {
  title: string;
  value: string;
  changeType?: "positive" | "neutral" | "negative";
  changePercentage?: number;
  unit?: string;
  color: ButtonProps["color"];
  categories: string[];
  chartData: ChartData[];
};

export const generateRandomHSLColor = (index: number): string => {
  // Generate a random hue (0-360)
  const hue = Math.floor(Math.random() * 360);
  // Keep saturation high for vibrant colors (60-80%)
  const saturation = 70;
  // Adjust lightness based on index to ensure variety (40-70%)
  const lightness = 40 + (index % 3) * 10;

  return `${hue} ${saturation}% ${lightness}%`;
};

export const CircleChartCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, "children"> & CircleChartProps
>(
  (
    {
      className,
      title,
      value,
      unit,
      categories,
      changePercentage,
      color,
      chartData,
      changeType,
      ...props
    },
    ref
  ) => {
    const chartColors = React.useMemo(
      () => chartData.map((_, index) => generateRandomHSLColor(index)),
      [chartData]
    );

    return (
      <Card
        ref={ref}
        className={cn("min-h-[340px] border border-transparent dark:border-default-100", className)}
        {...props}
      >
        <div className="flex flex-col gap-y-2 p-4 pb-0">
          <div className="flex items-center justify-between gap-x-2">
            <dt>
              <h3 className="text-small font-medium text-default-500">{title}</h3>
            </dt>
            <div className="flex items-center justify-end gap-x-2">
              <Select
                aria-label="Time Range"
                classNames={{
                  trigger: "min-w-[100px] min-h-7 h-7",
                  value: "text-tiny !text-default-500",
                  selectorIcon: "text-default-500",
                  popoverContent: "min-w-[120px]",
                }}
                defaultSelectedKeys={["per-day"]}
                listboxProps={{
                  itemClasses: {
                    title: "text-tiny",
                  },
                }}
                placeholder="Per Day"
                size="sm"
              >
                <SelectItem key="per-day">Per Day</SelectItem>
                <SelectItem key="per-week">Per Week</SelectItem>
                <SelectItem key="per-month">Per Month</SelectItem>
              </Select>
              <Dropdown
                classNames={{
                  content: "min-w-[120px]",
                }}
                placement="bottom-end"
              >
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <Icon height={16} icon="solar:menu-dots-bold" width={16} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  itemClasses={{
                    title: "text-tiny",
                  }}
                  variant="flat"
                >
                  <DropdownItem key="view-details">View Details</DropdownItem>
                  <DropdownItem key="export-data">Export Data</DropdownItem>
                  <DropdownItem key="set-alert">Set Alert</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <dd className="flex items-baseline gap-x-1">
            <span className="text-3xl font-semibold text-default-900">{value}</span>
            <span className="text-medium font-medium text-default-500">{unit}</span>
          </dd>
        </div>
        <ResponsiveContainer
          className="[&_.recharts-surface]:outline-none"
          height={200}
          width="100%"
        >
          <PieChart accessibilityLayer margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Tooltip
              content={({ label, payload }) => (
                <div className="flex h-8 min-w-[120px] items-center gap-x-2 rounded-medium bg-background px-1 text-tiny shadow-small">
                  <span className="font-medium text-foreground">{label}</span>
                  {payload?.map((p, index) => {
                    const name = p.name;
                    const value = p.value;
                    const category = categories.find((c) => c.toLowerCase() === name) ?? name;

                    return (
                      <div key={`${index}-${name}`} className="flex w-full items-center gap-x-2">
                        <div
                          className="h-2 w-2 flex-none rounded-full"
                          style={{
                            backgroundColor: `hsl(${chartColors[index]})`,
                          }}
                        />
                        <div className="flex w-full items-center justify-between gap-x-2 pr-1 text-xs text-default-700">
                          <span className="text-default-500">{category}</span>
                          <span className="font-mono font-medium text-default-700">
                            {formatValue(value as number)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              cursor={false}
            />
            <Pie
              animationDuration={1000}
              animationEasing="ease"
              cornerRadius={12}
              data={chartData}
              dataKey="value"
              innerRadius="68%"
              nameKey="name"
              paddingAngle={-20}
              strokeWidth={0}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(${chartColors[index]})`} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <>
                        {/* <Icon
                          className="text-default-400 [&>path]:stroke-2"
                          height={16}
                          icon={
                            changeType === "positive"
                              ? "solar:arrow-right-up-linear"
                              : changeType === "neutral"
                                ? "solar:arrow-right-linear"
                                : "solar:arrow-right-down-linear"
                          }
                          width={16}
                          x={viewBox.cx! - 40}
                          y={
                            viewBox.cy! -
                            (changeType === "positive" ? 8 : changeType === "negative" ? 6 : 0)
                          }
                        /> */}
                        <text
                          dominantBaseline="central"
                          textAnchor="middle"
                          x={viewBox.cx! + 10}
                          y={viewBox.cy!}
                        >
                          <tspan
                            dy={
                              changeType === "positive" ? -1.5 : changeType === "negative" ? 1.5 : 0
                            }
                            fill="hsl(var(--heroui-default-700))"
                            fontSize={20}
                            fontWeight={600}
                          >
                            {value}
                          </tspan>
                        </text>
                      </>
                    );
                  }

                  return null;
                }}
                position="center"
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="flex w-full flex-wrap justify-center gap-4 px-4 pb-4 text-tiny text-default-500">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center flex-wrap gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: `hsl(${chartColors[index]})`,
                }}
              />
              <span className="capitalize">{category}</span>
            </div>
          ))}
        </div>
      </Card>
    );
  }
);

CircleChartCard.displayName = "CircleChartCard";
