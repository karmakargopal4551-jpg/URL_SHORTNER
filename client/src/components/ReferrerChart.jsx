import React from "react";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const ReferrerChart = ({ data }) => {
    const chartData =
        data && data.length > 0
            ? data
            : [
                  {
                      name: "Direct",
                      value: 45,
                  },
                  {
                      name: "Google",
                      value: 30,
                  },
                  {
                      name: "Twitter",
                      value: 10,
                  },
                  {
                      name: "Facebook",
                      value: 8,
                  },
                  {
                      name: "Others",
                      value: 7,
                  },
              ];

    const colors = [
        "#635bff",
        "#22c55e",
        "#3b82f6",
        "#f97316",
        "#cbd5e1",
    ];

    return (
        <div className="dashboard-chart-card referrer-card">
            <div className="chart-header">
                <div>
                    <h3>Top Referrers</h3>

                    <p>
                        Where your visitors come from
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
                </select>
            </div>

            <div className="referrer-content">
                <div className="referrer-chart">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={3}
                            >
                                {chartData.map(
                                    (_, index) => (
                                        <Cell
                                            key={
                                                index
                                            }
                                            fill={
                                                colors[
                                                    index %
                                                        colors.length
                                                ]
                                            }
                                        />
                                    )
                                )}
                            </Pie>

                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="referrer-list">
                    {chartData.map(
                        (item, index) => (
                            <div
                                className="referrer-item"
                                key={item.name}
                            >
                                <div className="referrer-name">
                                    <span
                                        className="referrer-dot"
                                        style={{
                                            background:
                                                colors[
                                                    index %
                                                        colors.length
                                                ],
                                        }}
                                    />

                                    {item.name}
                                </div>

                                <strong>
                                    {item.value}%
                                </strong>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReferrerChart;