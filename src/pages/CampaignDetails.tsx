import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Calendar, Settings, Users, MessageSquare, Loader2, ChevronDown, ChevronUp, Building2, Hash, Search, BarChart3, CalendarIcon, Clock, User, Check } from 'lucide-react';
import CalendarWorkspace from '../components/CalendarWorkspace';
import { getCampaign, generateSchedule, getAdvancedSettings, updateAdvancedSettings } from '../lib/api';
import LoadingOverlay from '../components/LoadingOverlay';

const CampaignDetails: React.FC = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationResult, setGenerationResult] = useState<any>(null);
    const [expandedPersonas, setExpandedPersonas] = useState<Set<number>>(new Set());
    const [advancedSettings, setAdvancedSettings] = useState<any>(null);
    const [loadingSettings, setLoadingSettings] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);

    useEffect(() => {
        const loadCampaign = async () => {
            if (!id) return;
            try {
                const campaignData = await getCampaign(id);
                setCampaign(campaignData);
            } catch (error) {
                console.error('Failed to load campaign:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCampaign();
    }, [id]);

    const handleGenerate = async () => {
        if (!id) return;
        setIsGenerating(true);
        try {
            const result = await generateSchedule(id);
            setGenerationResult(result);

            // Refetch campaign to get updated posts
            const updatedCampaign = await getCampaign(id);
            setCampaign(updatedCampaign);

            alert(`Generated ${result.posts_created} posts and ${result.comments_created} comments!`);
        } catch (error: any) {
            alert(error.response?.data?.detail || "Failed to generate. Check console.");
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const loadAdvancedSettings = async () => {
        if (!id) return;
        setLoadingSettings(true);
        try {
            const settings = await getAdvancedSettings(id);
            setAdvancedSettings(settings);
        } catch (error) {
            console.error('Failed to load advanced settings:', error);
        } finally {
            setLoadingSettings(false);
        }
    };

    const saveAdvancedSettings = async () => {
        if (!id || !advancedSettings) return;
        setSavingSettings(true);
        try {
            await updateAdvancedSettings(id, advancedSettings);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings. Check console.');
        } finally {
            setSavingSettings(false);
        }
    };

    const handleTabChange = (value: string) => {
        if (value === 'config' && !advancedSettings && !loadingSettings) {
            loadAdvancedSettings();
        }
    };

    if (loading) {
        return <LoadingOverlay message="Loading campaign details..." />;
    }

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
                    <p className="text-gray-500">Manage campaign configuration and schedule.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                        Pause Campaign
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isGenerating ? 'Generating...' : 'Generate Next Week'}
                    </button>
                </div>
            </header>

            <Tabs defaultValue="schedule" onValueChange={handleTabChange}>
                <TabsList>
                    <TabsTrigger value="schedule" icon={Calendar}>Schedule</TabsTrigger>
                    <TabsTrigger value="config" icon={Settings}>Configuration</TabsTrigger>
                    <TabsTrigger value="personas" icon={Users}>Personas</TabsTrigger>
                    <TabsTrigger value="history" icon={MessageSquare}>History</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="schedule">
                        <CalendarWorkspace
                            posts={campaign?.posts || []}
                            campaignStartDate={campaign?.start_date || null}
                        />
                    </TabsContent>
                    <TabsContent value="config">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                            {/* Company Information */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Building2 className="w-5 h-5 text-brand-500" />
                                    <h3 className="font-semibold text-gray-900 text-lg">Company Information</h3>
                                </div>
                                <div className="grid gap-4 pl-7">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                            {campaign.company_name || 'Not set'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                            {campaign.company_info?.website || 'Not set'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 leading-relaxed">
                                            {campaign.company_info?.description || 'Not set'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Campaign Basics */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <CalendarIcon className="w-5 h-5 text-brand-500" />
                                    <h3 className="font-semibold text-gray-900 text-lg">Campaign Basics</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-4 pl-7">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                                campaign.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {campaign.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                            {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'Not set'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                            {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Not set'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Promotion Strategy */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <BarChart3 className="w-5 h-5 text-brand-500" />
                                    <h3 className="font-semibold text-gray-900 text-lg">Promotion Strategy</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-4 pl-7">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Posts Per Week</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={campaign.schedule?.max_posts_per_week || 5}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Comments Per Post</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="10"
                                            value={campaign.schedule?.max_comments_per_post || 3}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Mention Rate</label>
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                            {campaign.schedule?.company_mention_rate || 30}%
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-3 pl-7">
                                    Promotion settings are configured during campaign creation. To modify these settings, create a new campaign.
                                </p>
                            </div>

                            {/* Targeting */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <Search className="w-5 h-5 text-brand-500" />
                                    <h3 className="font-semibold text-gray-900 text-lg">Targeting</h3>
                                </div>
                                <div className="grid gap-4 pl-7">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Target Search Queries ({campaign.targeting?.keywords?.length || 0})
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {campaign.targeting?.keywords && campaign.targeting.keywords.length > 0 ? (
                                                campaign.targeting.keywords.map((keyword: string, idx: number) => (
                                                    <span 
                                                        key={idx}
                                                        className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm"
                                                    >
                                                        {keyword}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 text-sm">No keywords set</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Hash className="w-4 h-4 inline mr-1" />
                                            Target Subreddits ({campaign.targeting?.subreddits?.length || 0})
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {campaign.targeting?.subreddits && campaign.targeting.subreddits.length > 0 ? (
                                                campaign.targeting.subreddits.map((subreddit: string, idx: number) => (
                                                    <span 
                                                        key={idx}
                                                        className="px-3 py-1 bg-orange-50 text-orange-800 rounded-full text-sm"
                                                    >
                                                        {subreddit}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 text-sm">No subreddits set</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="personas">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-gray-900 text-lg">Campaign Personas</h3>
                                <span className="text-sm text-gray-500">
                                    {campaign?.personas?.length || 0} personas
                                </span>
                            </div>

                            <div className="space-y-3">
                                {campaign?.personas && campaign.personas.length > 0 ? (
                                    campaign.personas.map((persona: any) => (
                                        <div key={persona.id} className="border border-gray-200 rounded-lg p-5 hover:border-brand-200 transition">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="font-semibold text-gray-900 text-base">
                                                            {persona.username}
                                                        </h4>
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                                            {persona.tone_style || 'Professional'}
                                                        </span>
                                                    </div>
                                                    <button 
                                                        onClick={() => {
                                                            const newExpanded = new Set(expandedPersonas);
                                                            if (expandedPersonas.has(persona.id)) {
                                                                newExpanded.delete(persona.id);
                                                            } else {
                                                                newExpanded.add(persona.id);
                                                            }
                                                            setExpandedPersonas(newExpanded);
                                                        }}
                                                        className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium"
                                                    >
                                                        {expandedPersonas.has(persona.id) ? (
                                                            <>
                                                                <ChevronUp className="w-4 h-4" />
                                                                Hide backstory
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="w-4 h-4" />
                                                                Show backstory
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {expandedPersonas.has(persona.id) && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                        {persona.backstory}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>No personas configured for this campaign.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="history">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-gray-900 text-lg">Content History</h3>
                                <span className="text-sm text-gray-500">
                                    {campaign?.posts?.length || 0} posts, {campaign.posts?.reduce((total: number, post: any) => total + (post.comments?.length || 0), 0) || 0} comments
                                </span>
                            </div>
                            
                            <div className="space-y-6">
                                {campaign?.posts && campaign.posts.length > 0 ? (
                                    campaign.posts.map((post: any) => (
                                        <div key={post.id} className="border border-gray-200 rounded-lg p-5">
                                            {/* Post Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1"> 
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                                                            {post.subreddit}
                                                        </span>
                                                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                                                            post.status === 'SCHEDULED' 
                                                                ? 'bg-blue-100 text-blue-800' 
                                                                : 'bg-green-100 text-green-800'
                                                        }`}>
                                                            {post.status}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900 text-base mb-1">
                                                        {post.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        {post.body}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {/* Post Meta */}
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    <span>{post.author_username}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>
                                                        {post.scheduled_time 
                                                            ? new Date(post.scheduled_time).toLocaleString()
                                                            : 'Not scheduled'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* Comments */}
                                            {post.comments && post.comments.length > 0 && (
                                                <div className="border-t border-gray-100 pt-4 mt-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <MessageSquare className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                                                        {post.comments.map((comment: any) => (
                                                            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <User className="w-3 h-3 text-gray-400" />
                                                                    <span className="text-xs font-medium text-gray-900">
                                                                        {comment.author_username}
                                                                    </span>
                                                                    <span className="text-xs text-gray-400">•</span>
                                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                                    <span className="text-xs text-gray-500">
                                                                        {comment.scheduled_time 
                                                                            ? new Date(comment.scheduled_time).toLocaleString()
                                                                            : 'Not scheduled'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-700">
                                                                    {comment.content}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>No content generated yet.</p>
                                        <p className="text-sm mt-1">Click "Generate Next Week" to create posts and comments.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default CampaignDetails;
