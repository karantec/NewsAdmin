import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FiSearch } from 'react-icons/fi';

const DashboardMetric = ({ title, data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const CategoryCard = ({ category, count }) => (
  <div className="bg-white p-4 shadow-md rounded-2xl flex justify-between items-center">
    <span className="text-lg font-semibold text-gray-700">{category}</span>
    <span className="text-xl font-bold text-blue-600">{count}</span>
  </div>
);

const Dashboard = () => {
  const [metricsData, setMetricsData] = useState({
    newsCategories: {},
    blogCategories: {},
    podcastCategories: {},
  });

  useEffect(() => {
    const newCategoryName = "नया श्रेणी";
    const newCategoryCount = 13;
    
    const newsCounts = {
      अंतरराष्ट्रीय: 10,
      राष्ट्रीय: 5,
      राज्य: 3,
      राजनीति: 7,
      शिक्षा: 4,
      रोजगार: 8,
      पर्यटन: 6,
      खेल: 12,
      मौसम: 2,
      जायका: 9,
      स्वास्थ्य: 11,
      व्यापार: 6,
      भारत: 13,
      [newCategoryName]: newCategoryCount,
    };

    const blogCounts = {
      अंतरराष्ट्रीय: 8,
      राष्ट्रीय: 4,
      राज्य: 2,
      राजनीति: 5,
      शिक्षा: 3,
      रोजगार: 6,
      पर्यटन: 4,
      खेल: 7,
      मौसम: 2,
      जायका: 5,
      स्वास्थ्य: 6,
      व्यापार: 4,
      भारत: 10,
      [newCategoryName]: newCategoryCount,
    };

    const podcastCounts = {
      अंतरराष्ट्रीय: 6,
      राष्ट्रीय: 3,
      राज्य: 4,
      राजनीति: 5,
      शिक्षा: 2,
      रोजगार: 7,
      पर्यटन: 3,
      खेल: 9,
      मौसम: 1,
      जायका: 4,
      स्वास्थ्य: 5,
      व्यापार: 3,
      भारत: 8,
      [newCategoryName]: newCategoryCount,
    };

    setMetricsData({
      newsCategories: newsCounts,
      blogCategories: blogCounts,
      podcastCategories: podcastCounts,
    });
  }, []);

  const createChartData = (categoryCounts) => {
    return Object.entries(categoryCounts).map(([category, count]) => ({
      name: category,
      value: count,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Good Afternoon, Manish</h1>
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search" 
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <DashboardMetric 
          title="News Categories Count" 
          data={createChartData(metricsData.newsCategories)} 
        />
        <DashboardMetric 
          title="Blog Categories Count" 
          data={createChartData(metricsData.blogCategories)} 
        />
        <DashboardMetric 
          title="Podcast Categories Count" 
          data={createChartData(metricsData.podcastCategories)} 
        />
      </div>

      {/* Cards Section */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Category Post Counts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(metricsData.newsCategories).map(([category, count]) => (
          <CategoryCard key={category} category={category} count={count} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
