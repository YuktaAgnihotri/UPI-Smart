// app/dashboard/DashboardCharts.tsx
"use client";

import { useMemo } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";

// Define the shape of the props coming from the Server Component
interface ChartDataProps {
  data: {
    today: { category: string; amount: number; merchant: string }[];
    categories: { category: string; total: number }[];
    monthly: { month: string; total: number }[];
  };
}

// Colors for the Pie Chart slices
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF66B2'];

export default function Report({ data }: ChartDataProps) {
  
  // Group today's raw transactions by category for the Pie Chart
  const todayPieData = useMemo(() => {
    const grouped = data.today.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [data.today]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 bg-black text-amber-50">
      
      {/* 1. PIE CHART: Today's Spending */}
      <div className="p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4  bg-black text-amber-50">Today's Spending</h2>
        {todayPieData.length > 0 ? (
          <div className="h-72  bg-black text-amber-50 ">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={todayPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(Number(percent) * 100).toFixed(0)}%`}
                >
                  {todayPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value ?? 0).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center text-gray-500">
            No spending recorded today.
          </div>
        )}
      </div>

      {/* 2. BAR GRAPH: Total by Category */}
      <div className="p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 ">Spending by Category</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.categories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip 
                cursor={{ fill: '#F3F4F6' }}
                formatter={(value) => [`$${Number(value ?? 0).toFixed(2)}`, 'Total']}
              />
              <Bar dataKey="total" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. LINE GRAPH: Monthly Spending */}
      <div className="p-6  rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
        <h2 className="text-lg font-semibold mb-4 ">Monthly Trend</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthly} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip 
                formatter={(value) => [`$${Number(value ?? 0).toFixed(2)}`, 'Spent']}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}