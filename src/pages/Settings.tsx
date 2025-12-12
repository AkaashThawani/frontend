import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Plus, Edit2, Trash2, Search, Hash, Users as UsersIcon, X, Loader2 } from 'lucide-react';
import { getKeywords, createKeyword, updateKeyword, deleteKeyword, getSubreddits, createSubreddit, updateSubreddit, deleteSubreddit, getMasterPersonas, createMasterPersona, updateMasterPersona, deleteMasterPersona } from '../lib/api';

interface ModalState {
    isOpen: boolean;
    mode: 'add' | 'edit';
    item?: any;
}

const Settings: React.FC = () => {
    // Data state
    const [keywords, setKeywords] = useState<any[]>([]);
    const [subreddits, setSubreddits] = useState<any[]>([]);
    const [personas, setPersonas] = useState<any[]>([]);

    // Loading states
    const [loadingKeywords, setLoadingKeywords] = useState(false);
    const [loadingSubreddits, setLoadingSubreddits] = useState(false);
    const [loadingPersonas, setLoadingPersonas] = useState(false);
    const [savingKeyword, setSavingKeyword] = useState(false);
    const [savingSubreddit, setSavingSubreddit] = useState(false);
    const [savingPersona, setSavingPersona] = useState(false);

    // Modal states
    const [keywordModal, setKeywordModal] = useState<ModalState>({ isOpen: false, mode: 'add' });
    const [subredditModal, setSubredditModal] = useState<ModalState>({ isOpen: false, mode: 'add' });
    const [personaModal, setPersonaModal] = useState<ModalState>({ isOpen: false, mode: 'add' });

    // Form states
    const [keywordForm, setKeywordForm] = useState({ keyword: '', description: '' });
    const [subredditForm, setSubredditForm] = useState({ name: '', description: '' });
    const [personaForm, setPersonaForm] = useState({ username: '', backstory: '', tone_style: 'Professional' });

    const loadKeywords = async () => {
        setLoadingKeywords(true);
        try {
            const kw = await getKeywords();
            setKeywords(kw);
        } catch (error) {
            console.error('Failed to load keywords:', error);
        } finally {
            setLoadingKeywords(false);
        }
    };

    const loadSubreddits = async () => {
        setLoadingSubreddits(true);
        try {
            const sub = await getSubreddits();
            setSubreddits(sub);
        } catch (error) {
            console.error('Failed to load subreddits:', error);
        } finally {
            setLoadingSubreddits(false);
        }
    };

    const loadPersonas = async () => {
        setLoadingPersonas(true);
        try {
            const per = await getMasterPersonas();
            setPersonas(per);
        } catch (error) {
            console.error('Failed to load personas:', error);
        } finally {
            setLoadingPersonas(false);
        }
    };

    const handleTabChange = (value: string) => {
        if (value === 'keywords' && keywords.length === 0 && !loadingKeywords) {
            loadKeywords();
        } else if (value === 'subreddits' && subreddits.length === 0 && !loadingSubreddits) {
            loadSubreddits();
        } else if (value === 'personas' && personas.length === 0 && !loadingPersonas) {
            loadPersonas();
        }
    };

    // Keyword handlers
    const openKeywordModal = (mode: 'add' | 'edit', item?: any) => {
        if (mode === 'edit' && item) {
            setKeywordForm({ keyword: item.keyword, description: item.description || '' });
        } else {
            setKeywordForm({ keyword: '', description: '' });
        }
        setKeywordModal({ isOpen: true, mode, item });
    };

    const handleKeywordSubmit = async () => {
        setSavingKeyword(true);
        try {
            if (keywordModal.mode === 'add') {
                await createKeyword(keywordForm.keyword, keywordForm.description || undefined);
            } else if (keywordModal.item) {
                await updateKeyword(keywordModal.item.id, {
                    keyword: keywordForm.keyword,
                    description: keywordForm.description
                });
            }
            setKeywordModal({ isOpen: false, mode: 'add' });
            loadKeywords();
        } catch (error: any) {
            alert(error.response?.data?.detail || 'Operation failed');
        } finally {
            setSavingKeyword(false);
        }
    };

    const handleDeleteKeyword = async (id: number) => {
        if (!confirm('Delete this keyword?')) return;
        try {
            await deleteKeyword(id);
            loadKeywords();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    // Subreddit handlers
    const openSubredditModal = (mode: 'add' | 'edit', item?: any) => {
        if (mode === 'edit' && item) {
            setSubredditForm({ name: item.name, description: item.description || '' });
        } else {
            setSubredditForm({ name: '', description: '' });
        }
        setSubredditModal({ isOpen: true, mode, item });
    };

    const handleSubredditSubmit = async () => {
        setSavingSubreddit(true);
        try {
            if (subredditModal.mode === 'add') {
                await createSubreddit(subredditForm.name, subredditForm.description || undefined);
            } else if (subredditModal.item) {
                await updateSubreddit(subredditModal.item.id, {
                    name: subredditForm.name,
                    description: subredditForm.description
                });
            }
            setSubredditModal({ isOpen: false, mode: 'add' });
            loadSubreddits();
        } catch (error: any) {
            alert(error.response?.data?.detail || 'Operation failed');
        } finally {
            setSavingSubreddit(false);
        }
    };

    const handleDeleteSubreddit = async (id: number) => {
        if (!confirm('Delete this subreddit?')) return;
        try {
            await deleteSubreddit(id);
            loadSubreddits();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    // Persona handlers
    const openPersonaModal = (mode: 'add' | 'edit', item?: any) => {
        if (mode === 'edit' && item) {
            setPersonaForm({ username: item.username, backstory: item.backstory, tone_style: item.tone_style || 'Professional' });
        } else {
            setPersonaForm({ username: '', backstory: '', tone_style: 'Professional' });
        }
        setPersonaModal({ isOpen: true, mode, item });
    };

    const handlePersonaSubmit = async () => {
        setSavingPersona(true);
        try {
            if (personaModal.mode === 'add') {
                await createMasterPersona(personaForm.username, personaForm.backstory, personaForm.tone_style);
            } else if (personaModal.item) {
                await updateMasterPersona(personaModal.item.id, {
                    username: personaForm.username,
                    backstory: personaForm.backstory,
                    tone_style: personaForm.tone_style
                });
            }
            setPersonaModal({ isOpen: false, mode: 'add' });
            loadPersonas();
        } catch (error: any) {
            alert(error.response?.data?.detail || 'Operation failed');
        } finally {
            setSavingPersona(false);
        }
    };

    const handleDeletePersona = async (id: number) => {
        if (!confirm('Delete this persona?')) return;
        try {
            await deleteMasterPersona(id);
            loadPersonas();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <header className="px-6 pt-6 pb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your master keywords, subreddits, and personas.</p>
                </header>

                <Tabs defaultValue="keywords" onValueChange={handleTabChange}>
                    <div className="border-b border-gray-200 px-6 ">
                        <TabsList>
                            <TabsTrigger value="keywords" icon={Search}>Keywords</TabsTrigger>
                            <TabsTrigger value="subreddits" icon={Hash}>Subreddits</TabsTrigger>
                            <TabsTrigger value="personas" icon={UsersIcon}>Personas</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-6">
                        {/* Keywords Tab */}
                        <TabsContent value="keywords">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-900">All Keywords ({keywords.length})</h3>
                                    <button
                                        onClick={() => openKeywordModal('add')}
                                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium"
                                    >
                                        <Plus className="w-4 h-4" /> Add New
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {keywords.map((kw) => (
                                        <div key={kw.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-brand-200 transition">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{kw.keyword}</h4>
                                                {kw.description && <p className="text-sm text-gray-500 mt-1">{kw.description}</p>}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openKeywordModal('edit', kw)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteKeyword(kw.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {keywords.length === 0 && (
                                        <p className="text-center text-gray-500 py-8">No keywords yet. Click "Add New" to create one.</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* Subreddits Tab */}
                        <TabsContent value="subreddits">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-900">All Subreddits ({subreddits.length})</h3>
                                    <button
                                        onClick={() => openSubredditModal('add')}
                                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium"
                                    >
                                        <Plus className="w-4 h-4" /> Add New
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {subreddits.map((sub) => (
                                        <div key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-brand-200 transition">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{sub.name}</h4>
                                                {sub.description && <p className="text-sm text-gray-500 mt-1">{sub.description}</p>}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openSubredditModal('edit', sub)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSubreddit(sub.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {subreddits.length === 0 && (
                                        <p className="text-center text-gray-500 py-8">No subreddits yet. Click "Add New" to create one.</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* Personas Tab */}
                        <TabsContent value="personas">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-900">All Personas ({personas.length})</h3>
                                    <button
                                        onClick={() => openPersonaModal('add')}
                                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium"
                                    >
                                        <Plus className="w-4 h-4" /> Add New
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {personas.map((persona) => (
                                        <div key={persona.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-brand-200 transition">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{persona.username}</h4>
                                                    <span className="text-xs text-gray-500">{persona.tone_style}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openPersonaModal('edit', persona)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePersona(persona.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-3">{persona.backstory}</p>
                                        </div>
                                    ))}
                                    {personas.length === 0 && (
                                        <p className="text-center text-gray-500 py-8">No personas yet. Click "Add New" to create one.</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* Keyword Modal */}
            {keywordModal.isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgb(0 0 0 / 50%)' }}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{keywordModal.mode === 'add' ? 'Add' : 'Edit'} Keyword</h3>
                            <button onClick={() => setKeywordModal({ isOpen: false, mode: 'add' })} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Keyword *</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="e.g. AI presentation maker"
                                    value={keywordForm.keyword}
                                    onChange={(e) => setKeywordForm({ ...keywordForm, keyword: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="Optional"
                                    value={keywordForm.description}
                                    onChange={(e) => setKeywordForm({ ...keywordForm, description: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => setKeywordModal({ isOpen: false, mode: 'add' })}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleKeywordSubmit}
                                    disabled={!keywordForm.keyword.trim() || savingKeyword}
                                    className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {savingKeyword && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {savingKeyword ? 'Saving...' : (keywordModal.mode === 'add' ? 'Add' : 'Save')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Subreddit Modal */}
            {subredditModal.isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgb(0 0 0 / 50%)' }}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{subredditModal.mode === 'add' ? 'Add' : 'Edit'} Subreddit</h3>
                            <button onClick={() => setSubredditModal({ isOpen: false, mode: 'add' })} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subreddit *</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="e.g. r/startups"
                                    value={subredditForm.name}
                                    onChange={(e) => setSubredditForm({ ...subredditForm, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="Optional"
                                    value={subredditForm.description}
                                    onChange={(e) => setSubredditForm({ ...subredditForm, description: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => setSubredditModal({ isOpen: false, mode: 'add' })}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubredditSubmit}
                                    disabled={!subredditForm.name.trim() || savingSubreddit}
                                    className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {savingSubreddit && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {savingSubreddit ? 'Saving...' : (subredditModal.mode === 'add' ? 'Add' : 'Save')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Persona Modal */}
            {personaModal.isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgb(0 0 0 / 50%)' }}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{personaModal.mode === 'add' ? 'Add' : 'Edit'} Persona</h3>
                            <button onClick={() => setPersonaModal({ isOpen: false, mode: 'add' })} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                                        placeholder="e.g. riley_ops"
                                        value={personaForm.username}
                                        onChange={(e) => setPersonaForm({ ...personaForm, username: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tone Style</label>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                                        value={personaForm.tone_style}
                                        onChange={(e) => setPersonaForm({ ...personaForm, tone_style: e.target.value })}
                                    >
                                        <option>Professional</option>
                                        <option>Casual</option>
                                        <option>Technical</option>
                                        <option>Friendly</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Backstory *</label>
                                <textarea
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                                    rows={6}
                                    placeholder="Describe this persona's background, personality, and voice..."
                                    value={personaForm.backstory}
                                    onChange={(e) => setPersonaForm({ ...personaForm, backstory: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => setPersonaModal({ isOpen: false, mode: 'add' })}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePersonaSubmit}
                                    disabled={!personaForm.username.trim() || !personaForm.backstory.trim() || savingPersona}
                                    className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {savingPersona && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {savingPersona ? 'Saving...' : (personaModal.mode === 'add' ? 'Add' : 'Save')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
