import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import { getCampaigns } from '../lib/api';
import LoadingOverlay from '../components/LoadingOverlay';

const Campaigns: React.FC = () => {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCampaigns = async () => {
            try {
                const campaignsData = await getCampaigns();
                setCampaigns(campaignsData);
            } catch (error) {
                console.error('Failed to load campaigns:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCampaigns();
    }, []);

    if (loading) {
        return <LoadingOverlay message="Loading campaigns..." />;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <header className="flex items-center justify-between px-6 pt-6 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
                        <p className="text-gray-500 mt-1">Manage your active reddit strategies.</p>
                    </div>
                    <Link to="/campaigns/new" className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition">
                        <Plus className="w-5 h-5" />
                        New Campaign
                    </Link>
                </header>

                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
                        <tr>
                            <th className="px-6 py-4">Campaign Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Created At</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {campaigns.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50/50 transition group">
                                <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <Link to={`/campaigns/${c.id}`} className="cursor-pointer">
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 transition" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {campaigns.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    No campaigns found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Campaigns;
