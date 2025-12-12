import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, ChevronUp, Check, X, Search, Calendar as CalendarIcon, Hash, BarChart3, Users, Building2 } from 'lucide-react';
import clsx from 'clsx';
import { createCampaign, getMasterPersonas, getKeywords, getSubreddits, generateSchedule } from '../lib/api';
import LoadingOverlay from '../components/LoadingOverlay';

const NewCampaign: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [expandedPersonas, setExpandedPersonas] = useState<Set<number>>(new Set());

    // Master data from API
    const [availablePersonas, setAvailablePersonas] = useState<any[]>([]);
    const [availableKeywords, setAvailableKeywords] = useState<any[]>([]);
    const [availableSubreddits, setAvailableSubreddits] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // Load master data on component mount
    useEffect(() => {
        const loadMasterData = async () => {
            try {
                const [personas, keywords, subreddits] = await Promise.all([
                    getMasterPersonas(),
                    getKeywords(),
                    getSubreddits()
                ]);
                setAvailablePersonas(personas);
                setAvailableKeywords(keywords);
                setAvailableSubreddits(subreddits);
            } catch (error) {
                console.error('Failed to load master data:', error);
            } finally {
                setLoadingData(false);
            }
        };
        loadMasterData();
    }, []);

    // Form State
    const [formData, setFormData] = useState({
        companyName: '',
        companyWebsite: '',
        companyDescription: '',
        campaignName: '',
        campaignType: 'Brand Awareness',
        startDate: '',
        endDate: '',
        subreddits: [] as string[],
        keywords: [] as string[],
        maxPostsPerWeek: 5,  // CHANGED from postsPerWeek
        maxCommentsPerPost: 3,  // NEW
        companyMentionRate: 30,  // NEW: 0-100%
        mentionInPosts: false,   // NEW: mention in posts
        mentionInComments: true, // NEW: mention in comments
        personas: [] as any[]
    });

    // Inputs for adding items
    const [subredditInput, setSubredditInput] = useState('');
    const [keywordInput, setKeywordInput] = useState('');
    const [showKeywordDropdown, setShowKeywordDropdown] = useState(false);
    const [showSubredditDropdown, setShowSubredditDropdown] = useState(false);

    const campaignTypes = [
        'Brand Awareness',
        'Product Launch',
        'Lead Generation',
        'Community Building'
    ];

    const steps = [
        { id: 1, name: "Company" },
        { id: 2, name: "Basics" },
        { id: 3, name: "Strategy" },
        { id: 4, name: "Personas" }
    ];

    // Helper to add chip
    const addChip = (value: string, field: 'subreddits' | 'keywords', setInput: (v: string) => void) => {
        if (!value.trim()) return;
        const val = value.trim();
        if (!formData[field].includes(val)) {
            setFormData({ ...formData, [field]: [...formData[field], val] });
        }
        setInput('');
    };

    const removeChip = (value: string, field: 'subreddits' | 'keywords') => {
        setFormData({ ...formData, [field]: formData[field].filter(v => v !== value) });
    };

    const togglePersona = (persona: any) => {
        const exists = formData.personas.find(p => p.id === persona.id);
        if (exists) {
            setFormData({ ...formData, personas: formData.personas.filter(p => p.id !== persona.id) });
        } else {
            setFormData({ ...formData, personas: [...formData.personas, persona] });
        }
    };

    const toggleExpanded = (personaId: number) => {
        const newExpanded = new Set(expandedPersonas);
        if (newExpanded.has(personaId)) {
            newExpanded.delete(personaId);
        } else {
            newExpanded.add(personaId);
        }
        setExpandedPersonas(newExpanded);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                campaign_name: formData.campaignName,
                company_name: formData.companyName,
                company_site: formData.companyWebsite,
                company_description: formData.companyDescription,
                personas: formData.personas.map(p => ({
                    username: p.username,
                    backstory: p.backstory,
                    tone_style: p.tone_style || "Professional"
                })),
                subreddits: formData.subreddits,
                keywords: formData.keywords.map((keyword, index) => ({
                    id: `K${index + 1}`,
                    keyword: keyword
                })),
                max_posts_per_week: formData.maxPostsPerWeek,
                max_comments_per_post: formData.maxCommentsPerPost,
                company_mention_rate: formData.companyMentionRate,
                mention_in_posts: formData.mentionInPosts,
                mention_in_comments: formData.mentionInComments,
                start_date: formData.startDate || null,
                end_date: formData.endDate || null
            };
            const result = await createCampaign(payload);

            // Auto-generate first week with loading overlay
            setIsGenerating(true);
            try {
                await generateSchedule(result.id);
                console.log("✓ Generated first week of posts");
            } catch (genError) {
                console.error("Failed to generate first week:", genError);
                // Don't block navigation, just log the error
            } finally {
                setIsGenerating(false);
            }

            navigate(`/campaigns/${result.id}`);
        } catch (error) {
            console.error("Failed to create campaign", error);
            alert("Error creating campaign. Check backend.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingData) {
        return <LoadingOverlay message="Loading campaign data..." />;
    }

    return (
        <>
            <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[500px]">
                <header className="px-8 pt-6 pb-4">
                    <h1 className="text-2xl font-bold text-gray-900">New Campaign</h1>
                    <p className="text-gray-500 mt-1">Configure your organic growth campaign.</p>
                </header>

                {/* Stepper */}
                <div className="flex items-center gap-4 px-8 pb-6">
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex items-center">
                            <div className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors",
                                step >= s.id ? "bg-brand-600 text-white" : "bg-gray-200 text-gray-500"
                            )}>
                                {step > s.id ? <Check className="w-5 h-5" /> : s.id}
                            </div>
                            <span className={clsx(
                                "ml-2 text-sm font-medium",
                                step >= s.id ? "text-gray-900" : "text-gray-500"
                            )}>
                                {s.name}
                            </span>
                            {i < steps.length - 1 && (
                                <div className="w-16 h-0.5 bg-gray-200 mx-4" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-8 border-t border-gray-100">
                    <div className="w-full">

                        {/* Step 1: Company Info */}
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-brand-500" /> Company Information
                                </h2>

                                <div className="grid gap-6 w-full">
                                    <div className="grid grid-cols-2 gap-4 w-full">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Company Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                                                placeholder="e.g. SlideForge"
                                                value={formData.companyName}
                                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                autoFocus
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                                                placeholder="e.g. slideforge.ai"
                                                value={formData.companyWebsite}
                                                onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Company Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                                            rows={6}
                                            placeholder="Describe your company, what it does, and who it serves..."
                                            value={formData.companyDescription}
                                            onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">This helps generate more contextual and relevant content.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Campaign Basics */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-brand-500" /> Campaign Basics
                                </h2>

                                <div className="grid gap-6 w-full">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Campaign Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                                            placeholder="e.g. Q4 Product Launch"
                                            value={formData.campaignName}
                                            onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Type</label>
                                        <select
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                                            value={formData.campaignType}
                                            onChange={(e) => setFormData({ ...formData, campaignType: e.target.value })}
                                        >
                                            {campaignTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Start Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                            <input
                                                type="date"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Strategy */}
                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-brand-500" /> Targeting & Volume
                                </h2>

                                {/* Keywords */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Target Search Queries <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-xs text-gray-500">Full questions or search phrases people use (e.g., "How do I create presentations faster?")</p>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.keywords.map(k => (
                                            <span key={k} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                                                {k}
                                                <button onClick={() => removeChip(k, 'keywords')} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="relative w-full">
                                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                                            placeholder="Search keywords from master list..."
                                            value={keywordInput}
                                            onChange={(e) => {
                                                setKeywordInput(e.target.value);
                                                setShowKeywordDropdown(e.target.value.length > 0);
                                            }}
                                            onFocus={() => keywordInput.length > 0 && setShowKeywordDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowKeywordDropdown(false), 200)}
                                        />
                                        {showKeywordDropdown && availableKeywords.filter(k =>
                                            k.keyword.toLowerCase().includes(keywordInput.toLowerCase()) &&
                                            !formData.keywords.includes(k.keyword)
                                        ).length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                {availableKeywords
                                                    .filter(k =>
                                                        k.keyword.toLowerCase().includes(keywordInput.toLowerCase()) &&
                                                        !formData.keywords.includes(k.keyword)
                                                    )
                                                    .map(k => (
                                                        <div
                                                            key={k.id}
                                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                            onClick={() => {
                                                                addChip(k.keyword, 'keywords', setKeywordInput);
                                                                setShowKeywordDropdown(false);
                                                            }}
                                                        >
                                                            <div className="font-medium text-gray-900">{k.keyword}</div>
                                                            {k.description && <div className="text-xs text-gray-500 mt-0.5">{k.description}</div>}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Subreddits */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Target Subreddits <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.subreddits.map(sub => (
                                            <span key={sub} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm">
                                                {sub}
                                                <button onClick={() => removeChip(sub, 'subreddits')} className="hover:text-orange-900"><X className="w-3 h-3" /></button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="relative w-full">
                                        <Hash className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                                            placeholder="Search subreddits from master list..."
                                            value={subredditInput}
                                            onChange={(e) => {
                                                setSubredditInput(e.target.value);
                                                setShowSubredditDropdown(e.target.value.length > 0);
                                            }}
                                            onFocus={() => subredditInput.length > 0 && setShowSubredditDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowSubredditDropdown(false), 200)}
                                        />
                                        {showSubredditDropdown && availableSubreddits.filter(s =>
                                            s.name.toLowerCase().includes(subredditInput.toLowerCase()) &&
                                            !formData.subreddits.includes(s.name)
                                        ).length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                {availableSubreddits
                                                    .filter(s =>
                                                        s.name.toLowerCase().includes(subredditInput.toLowerCase()) &&
                                                        !formData.subreddits.includes(s.name)
                                                    )
                                                    .map(s => (
                                                        <div
                                                            key={s.id}
                                                            className="px-4 py-2 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                            onClick={() => {
                                                                addChip(s.name, 'subreddits', setSubredditInput);
                                                                setShowSubredditDropdown(false);
                                                            }}
                                                        >
                                                            <div className="font-medium text-gray-900">{s.name}</div>
                                                            {s.description && <div className="text-xs text-gray-500 mt-0.5">{s.description}</div>}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Promotion Strategy */}
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-900">Promotion Strategy</h3>
                                    
                                    {/* Volume Controls */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Posts Per Week</label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="15"
                                                value={formData.maxPostsPerWeek}
                                                onChange={(e) => setFormData({ ...formData, maxPostsPerWeek: Number(e.target.value) })}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                                            />
                                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                                <span>1</span>
                                                <span className="font-medium text-brand-600">{formData.maxPostsPerWeek}</span>
                                                <span>15</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Comments Per Post</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="20"
                                                value={formData.maxCommentsPerPost}
                                                onChange={(e) => setFormData({ ...formData, maxCommentsPerPost: Number(e.target.value) })}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                                            />
                                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                                <span>0</span>
                                                <span className="font-medium text-brand-600">{formData.maxCommentsPerPost}</span>
                                                <span>20</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Company Mention Controls */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Company Mention Rate */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Company Mention Rate
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={formData.companyMentionRate}
                                                onChange={(e) => setFormData({ 
                                                    ...formData, 
                                                    companyMentionRate: Number(e.target.value) 
                                                })}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                                            />
                                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                                <span>0%</span>
                                                <span className="font-medium text-brand-600">
                                                    {formData.companyMentionRate}%
                                                </span>
                                                <span>100%</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Percentage of comments that mention your company
                                            </p>
                                        </div>

                                        {/* Where to Mention */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mention Company In
                                            </label>
                                            <div className="flex items-center gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.mentionInPosts}
                                                        onChange={(e) => setFormData({ 
                                                            ...formData, 
                                                            mentionInPosts: e.target.checked 
                                                        })}
                                                        className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Posts</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.mentionInComments}
                                                        onChange={(e) => setFormData({ 
                                                            ...formData, 
                                                            mentionInComments: e.target.checked 
                                                        })}
                                                        className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Comments</span>
                                                </label>
                                            </div>
                                            {!formData.mentionInPosts && !formData.mentionInComments && (
                                                <p className="text-xs text-red-500 mt-2">
                                                    ⚠️ Select at least one option
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preset Strategies */}
                                    <div className="pt-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quick Presets
                                        </label>
                                        <div className="flex gap-2 flex-wrap">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    maxPostsPerWeek: 5,
                                                    maxCommentsPerPost: 4,
                                                    companyMentionRate: 20,
                                                    mentionInPosts: false,
                                                    mentionInComments: true
                                                })}
                                                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                            >
                                                🌱 Conservative
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    maxPostsPerWeek: 8,
                                                    maxCommentsPerPost: 8,
                                                    companyMentionRate: 40,
                                                    mentionInPosts: false,
                                                    mentionInComments: true
                                                })}
                                                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                            >
                                                ⚖️ Moderate
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    maxPostsPerWeek: 12,
                                                    maxCommentsPerPost: 12,
                                                    companyMentionRate: 60,
                                                    mentionInPosts: true,
                                                    mentionInComments: true
                                                })}
                                                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                            >
                                                📊 Standard
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    maxPostsPerWeek: 15,
                                                    maxCommentsPerPost: 15,
                                                    companyMentionRate: 80,
                                                    mentionInPosts: true,
                                                    mentionInComments: true
                                                })}
                                                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                            >
                                                📢 Aggressive
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Personas */}
                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-brand-500" /> Select Personas
                                    </h2>
                                    <span className="text-sm text-gray-500">
                                        {formData.personas.length} Selected (min. 2 required)
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {availablePersonas.map((p) => {
                                        const isSelected = formData.personas.some(sel => sel.id === p.id);
                                        const isExpanded = expandedPersonas.has(p.id);
                                        const preview = p.backstory.substring(0, 150) + '...';

                                        return (
                                            <div
                                                key={p.id}
                                                className={clsx(
                                                    "p-4 border rounded-lg transition-all relative cursor-pointer",
                                                    isSelected
                                                        ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                                                        : "border-gray-200 hover:border-brand-200 hover:bg-gray-50"
                                                )}
                                                onClick={() => togglePersona(p)}
                                            >
                                                <div className="flex justify-between items-start mb-2 ">
                                                    <h4
                                                        className={clsx(
                                                            "font-semibold ",
                                                            isSelected ? "text-brand-900" : "text-gray-900"
                                                        )}
                                                        
                                                    >
                                                        {p.username}
                                                    </h4>
                                                    <div
                                                        className="cursor-pointer"
                                                        onClick={() => togglePersona(p)}
                                                    >
                                                        {isSelected && <Check className="w-5 h-5 text-brand-600" />}
                                                    </div> 
                                                </div>

                                                <div className={clsx(
                                                    "text-sm leading-relaxed",
                                                    isSelected ? "text-brand-700" : "text-gray-600"
                                                )}>
                                                    {isExpanded ? (
                                                        <div className="max-h-64 overflow-y-auto pr-2">
                                                            {p.backstory}
                                                        </div>
                                                    ) : (
                                                        <div>{preview}</div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => toggleExpanded(p.id)}
                                                    className={clsx(
                                                        "mt-2 text-xs font-medium flex items-center gap-1 hover:underline",
                                                        isSelected ? "text-brand-600" : "text-gray-500"
                                                    )}
                                                >
                                                    {isExpanded ? (
                                                        <>Show less <ChevronUp className="w-3 h-3" /></>
                                                    ) : (
                                                        <>Read more <ChevronDown className="w-3 h-3" /></>
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
                            <button
                                onClick={() => step > 1 ? setStep(step - 1) : navigate('/campaigns')}
                                className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
                            >
                                {step === 1 ? 'Cancel' : 'Back'}
                            </button>

                            {step < 4 ? (
                                <button
                                    onClick={() => setStep(step + 1)}
                                    disabled={
                                        (step === 1 && (!formData.companyName || !formData.companyDescription)) ||
                                        (step === 2 && (!formData.campaignName || !formData.startDate)) ||
                                        (step === 3 && (formData.keywords.length === 0 || formData.subreddits.length === 0))
                                    }
                                    className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium transition shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next Step <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || formData.personas.length < 2}
                                    className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm hover:shadow"
                                >
                                    {isSubmitting ? 'Creating...' : 'Launch Campaign'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isGenerating && (
                <LoadingOverlay message="Generating week 1 content and posts, takes some time" />
            )}
        </div>
        </> 
    );
};

export default NewCampaign;
