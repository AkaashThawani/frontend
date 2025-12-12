import React, { useEffect, useState } from 'react';
import { MetricCard } from '../components/MetricCard';
import { Users, FileText, BarChart3, Activity, Clock } from 'lucide-react';
import { getMetrics, getCampaigns } from '../lib/api';
import LoadingOverlay from '../components/LoadingOverlay';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [upcomingPosts, setUpcomingPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // Load metrics
                const metricsData = await getMetrics();
                setStats(metricsData);

                // Load upcoming posts from all campaigns
                const campaigns = await getCampaigns();
                const allPosts: any[] = [];

                for (const campaign of campaigns) {
                    try {
                        const response = await fetch(`http://localhost:8000/api/campaigns/${campaign.id}`);
                        const data = await response.json();
                        if (data.posts) {
                            allPosts.push(...data.posts.map((p: any) => ({
                                ...p,
                                campaign_name: campaign.name
                            })));
                        }
                    } catch (error) {
                        console.error('Failed to load campaign posts:', error);
                    }
                }

                // Sort by scheduled_time and take next 5
                const upcoming = allPosts
                    .filter(p => p.scheduled_time && new Date(p.scheduled_time) > new Date())
                    .sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime())
                    .slice(0, 5);

                setUpcomingPosts(upcoming);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const metrics = [
        { title: "Active Campaigns", value: stats?.active_campaigns || 0, trend: `${stats?.total_campaigns || 0} total`, trendUp: true, icon: Activity },
        { title: "Total Personas", value: stats?.total_personas || 0, trend: "Across all campaigns", trendUp: true, icon: Users },
        { title: "Total Posts", value: stats?.total_posts || 0, trend: "Generated content", trendUp: true, icon: FileText },
        { title: "Total Comments", value: stats?.total_comments || 0, trend: `${stats?.system_health || 'Operational'}`, trendUp: true, icon: BarChart3 },
    ];

    if (loading) {
        return <LoadingOverlay message="Loading dashboard..." />;
    }

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Overview of your organic growth machine.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <MetricCard key={i} {...m} />
                ))}
            </div>

            {/* Upcoming Activity */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Activity</h2>
                <div className="space-y-3">
                    {upcomingPosts.length > 0 ? (
                        upcomingPosts.map((post) => (
                            <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded shrink-0">
                                        {post.subreddit}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-gray-900 truncate">{post.title}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                <span>
                                                    {new Date(post.scheduled_time).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400">•</span>
                                            <span className="text-xs text-gray-500">{post.campaign_name}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded shrink-0 ${
                                    post.status === 'SCHEDULED' 
                                        ? 'bg-blue-50 text-blue-700' 
                                        : 'bg-green-50 text-green-700'
                                }`}>
                                    {post.status}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No upcoming posts scheduled.</p>
                            <p className="text-sm mt-1">Create a campaign and generate content to see upcoming activity.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
