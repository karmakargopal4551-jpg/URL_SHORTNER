import React from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";

const ClicksChart = ({ data = [] }) => {
    const chartData =
        data.length > 0
            ? data
            : [
                  { day: "Mon", clicks: 0 },
                  { day: "Tue", clicks: 1 },
                  { day: "Wed", clicks: 0 },
                  { day: "Thu", clicks: 1 },
                  { day: "Fri", clicks: 0 },
                  { day: "Sat", clicks: 2 },
                  { day: "Sun", clicks: 2 },
              ];

    return (
        <div className="dashboard-chart-card">
            <div className="chart-header">
                <div>
                    <h3>Clicks Overview</h3>

                    <p>
                        Track your link performance
                    </p>
                </div>

                <select
                    className="chart-select"
                    defaultValue="7"
                >
                    <option value="7">
                        Last 7 Days
                    </option>

                    <option value="30">
                        Last 30 Days
                    </option>

                    <option value="90">
                        Last 90 Days
                    </option>
                </select>
            </div>

            <div className="chart-container">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <AreaChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 10,
                            left: -20,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient
                                id="clickGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#635bff"
                                    stopOpacity={0.25}
                                />

                                <stop
                                    offset="95%"
                                    stopColor="#635bff"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e8e8f3"
                        />

                        <XAxis
                            dataKey="day"
                            stroke="#8a8fa8"
                            fontSize={12}
                        />

                        <YAxis
                            allowDecimals={false}
                            stroke="#8a8fa8"
                            fontSize={12}
                        />

                        <Tooltip />

                        <Area
                            type="monotone"
                            dataKey="clicks"
                            stroke="#635bff"
                            strokeWidth={3}
                            fill="url(#clickGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ClicksChart;