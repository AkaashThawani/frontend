import React from 'react';
import { MetricCard } from '../components/MetricCard';
import { Target, TrendingUp, Search, MousePointerClick } from 'lucide-react';

const Goals: React.FC = () => {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Business Goals</h1>
                <p className="text-gray-500">Track the impact of your campaigns on actual business metrics.</p>
            </header>

            {/* Impact Cards */}
            <div className="grid grid-cols-4 gap-6">
                <MetricCard title="Est. Inbound Leads" value="34" trend="+8 this week" trendUp={true} icon={Target} />
                <MetricCard title="Click-through Rate" value="2.4%" trend="-0.1% vs avg" trendUp={false} icon={MousePointerClick} />
                <MetricCard title="Share of Voice" value="15%" trend="Top 3 in r/SaaS" trendUp={true} icon={TrendingUp} />
                <MetricCard title="Keyword Rankings" value="#4" trend="Moved up 2 spots" trendUp={true} icon={Search} />
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-6">Traffic Source Attribution</h3>
                    <div className="h-64 flex items-end justify-between px-4 pb-4 border-b border-gray-100 gap-4">
                        {/* Mock Bar Chart */}
                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} className="w-full bg-brand-100 rounded-t relative group">
                                <div
                                    className="absolute bottom-0 w-full bg-brand-500 rounded-t transition-all duration-500 group-hover:bg-brand-600"
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-6">Keyword Reach</h3>
                    <div className="space-y-4">
                        {['ai presentation', 'startup pitch deck', 'powerpoint alternative', 'automate slides'].map((k, i) => (
                            <div key={k}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{k}</span>
                                    <span className="text-gray-500">Top {i + 1}</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-500" style={{ width: `${90 - (i * 15)}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Goals;
