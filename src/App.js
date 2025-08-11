import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, TrendingUp, Clock, Shuffle, Send, ThumbsUp,
  Share2, MessageCircle, Flag, Shield, BarChart3,
  Home, Plus, UserCheck, X, Check, Trash2, AlertTriangle,
  Zap, Heart, Laugh, HelpCircle, AlertOctagon, Star, Menu
} from 'lucide-react';
import axios from 'axios';

// Configure axios
const API_URL = (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) || 'http://localhost:5000/api';
axios.defaults.baseURL = API_URL;

// Main App Component
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-wtf-dark">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(18, 18, 42, 0.9)',
              color: '#e5e7eb',
              borderRadius: '8px',
              border: '1px solid rgba(255, 107, 53, 0.3)',
              padding: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/story/:id" element={<StoryPage />} />
          <Route path="/submit" element={<SubmitStory />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

// Navigation Component
const Navigation = ({ currentTab, onTabChange, showSubmit = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-wtf-dark sticky top-0 z-50 border-b border-wtf-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-wtf-primary rounded-lg flex items-center justify-center group-hover:animate-glow transition-all duration-300">
              <Flame className="w-6 h-6 text-wtf-dark" />
            </div>
            <span className="text-2xl font-bold text-wtf-light">WTF Just Happened</span>
          </Link>

          {/* Desktop Navigation */}
          {onTabChange && currentTab && (
            <div className="hidden md:flex space-x-2 bg-wtf-bg/50 rounded-lg p-1">
              {[
                { id: 'hot', label: 'Hot', icon: Flame },
                { id: 'new', label: 'New', icon: Clock },
                { id: 'top', label: 'Top', icon: TrendingUp },
                { id: 'random', label: 'Random', icon: Shuffle },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentTab === tab.id
                        ? 'bg-wtf-primary text-wtf-dark'
                        : 'text-wtf-light/70 hover:text-wtf-light hover:bg-wtf-bg'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Mobile Navigation Toggle */}
          <button
            className="md:hidden btn-icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Submit Button */}
          {showSubmit && (
            <Link to="/submit" className="btn-primary hidden md:flex">
              <Plus className="w-5 h-5" />
              <span>Share Your WTF</span>
            </Link>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-wtf-bg rounded-lg p-4 mt-2"
            >
              {onTabChange && currentTab && (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'hot', label: 'Hot', icon: Flame },
                    { id: 'new', label: 'New', icon: Clock },
                    { id: 'top', label: 'Top', icon: TrendingUp },
                    { id: 'random', label: 'Random', icon: Shuffle },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          onTabChange(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          currentTab === tab.id
                            ? 'bg-wtf-primary text-wtf-dark'
                            : 'text-wtf-light/70 hover:text-wtf-light hover:bg-wtf-bg'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {showSubmit && (
                <Link
                  to="/submit"
                  className="btn-primary w-full mt-4 justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Plus className="w-5 h-5" />
                  <span>Share Your WTF</span>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

// Homepage Component
const HomePage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('hot');
  const [selectedTag, setSelectedTag] = useState('all');
  const [tags, setTags] = useState([]);
  const [dailyPrompt, setDailyPrompt] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchTags();
    fetchDailyPrompt();
    fetchStories(true);
  }, [currentTab, selectedTag]);

  const fetchTags = async () => {
    try {
      const response = await axios.get('/tags');
      setTags(['all', ...response.data]);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchDailyPrompt = async () => {
    try {
      const response = await axios.get('/daily-prompt');
      setDailyPrompt(response.data);
    } catch (error) {
      console.error('Error fetching daily prompt:', error);
    }
  };

  const fetchStories = async (reset = false) => {
    try {
      setLoading(true);
      const currentOffset = reset ? 0 : offset;
      const response = await axios.get('/stories', {
        params: {
          sort: currentTab,
          tag: selectedTag === 'all' ? undefined : selectedTag,
          limit: 20,
          offset: currentOffset,
        },
      });

      if (reset) {
        setStories(response.data.stories);
        setOffset(20);
      } else {
        setStories((prev) => [...prev, ...response.data.stories]);
        setOffset((prev) => prev + 20);
      }
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setOffset(0);
  };

  const handleTagChange = (tag) => {
    setSelectedTag(tag);
    setOffset(0);
  };

  return (
    <div className="min-h-screen">
      <Navigation currentTab={currentTab} onTabChange={handleTabChange} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Daily Prompt */}
        {dailyPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card mb-8 animate-glow"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Star className="w-6 h-6 text-wtf-accent" />
              <h2 className="text-2xl font-bold text-wtf-light">Today's Prompt</h2>
            </div>
            <p className="text-lg text-wtf-light/80 mb-4">{dailyPrompt.prompt}</p>
            <Link to="/submit" className="btn-primary">
              <Zap className="w-5 h-5" />
              <span>Share Your Story</span>
            </Link>
          </motion.div>
        )}

        {/* Tag Filter */}
        <div className="sticky top-16 z-40 bg-wtf-bg/50 rounded-lg p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`tag ${selectedTag === tag ? 'tag-active' : ''}`}
              >
                {tag === 'all' ? 'All Stories' : `#${tag}`}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mb-8 bg-wtf-bg/50 rounded-lg p-2">
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'hot', label: 'Hot', icon: Flame },
              { id: 'new', label: 'New', icon: Clock },
              { id: 'top', label: 'Top', icon: TrendingUp },
              { id: 'random', label: 'Random', icon: Shuffle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex flex-col items-center space-y-1 p-3 rounded-lg text-xs font-medium transition-all duration-300 ${
                    currentTab === tab.id
                      ? 'bg-wtf-primary text-wtf-dark'
                      : 'text-wtf-light/70 hover:text-wtf-light hover:bg-wtf-bg'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stories Grid */}
        <div className="space-y-6">
          <AnimatePresence>
            {stories.map((story, index) => (
              <StoryCard key={story.id} story={story} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="text-center mt-8">
            <button
              onClick={() => fetchStories(false)}
              className="btn-secondary"
            >
              Load More Stories
            </button>
          </div>
        )}

        {/* Skeleton Loader */}
        {loading && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-6 w-16 bg-wtf-bg/50 rounded-full"></div>
                  <div className="h-4 w-24 bg-wtf-bg/50 rounded"></div>
                </div>
                <div className="h-6 w-3/4 bg-wtf-bg/50 rounded mb-2"></div>
                <div className="h-4 w-full bg-wtf-bg/50 rounded mb-1"></div>
                <div className="h-4 w-5/6 bg-wtf-bg/50 rounded"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Story Card Component
const StoryCard = ({ story, index }) => {
  const [reactions, setReactions] = useState(story.reactions);
  const [upvotes, setUpvotes] = useState(story.upvotes);
  const [hasReacted, setHasReacted] = useState({});
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleReaction = async (reaction) => {
    if (hasReacted[reaction]) return;
    try {
      await axios.post(`/stories/${story.id}/react`, { reaction });
      setReactions((prev) => ({ ...prev, [reaction]: prev[reaction] + 1 }));
      setHasReacted((prev) => ({ ...prev, [reaction]: true }));
      toast.success(`Reacted with ${reaction}!`);
    } catch (error) {
      toast.error('Failed to add reaction');
    }
  };

  const handleUpvote = async () => {
    if (hasUpvoted) return;
    try {
      await axios.post(`/stories/${story.id}/upvote`);
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
      toast.success('Upvoted!');
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  const handleSimilar = async () => {
    try {
      await axios.post(`/stories/${story.id}/similar`);
      toast.success('Marked as similar! Share your version too!');
    } catch (error) {
      toast.error('Failed to mark as similar');
    }
  };

  const shareStory = () => {
    const url = `${window.location.origin}/story/${story.id}`;
    if (navigator.share) {
      navigator.share({
        title: story.title || 'WTF Just Happened Story',
        text: story.content,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Story link copied to clipboard!');
    }
  };

  const reactionIcons = {
    WTF: { icon: AlertOctagon, color: 'text-wtf-danger', label: 'WTF' },
    Fake: { icon: X, color: 'text-wtf-light/70', label: 'Fake' },
    Same: { icon: Check, color: 'text-wtf-success', label: 'Same' },
    Laughed: { icon: Laugh, color: 'text-wtf-accent', label: 'Laughed' },
    'Get Help': { icon: HelpCircle, color: 'text-wtf-secondary', label: 'Get Help' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="card"
    >
      {/* Story Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="badge">#{story.tag}</span>
          <span className="text-wtf-light/60 text-sm">
            {new Date(story.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-wtf-light/70">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm">{upvotes}</span>
          </div>
          <button
            onClick={shareStory}
            className="btn-icon relative group"
            aria-label="Share story"
          >
            <Share2 className="w-4 h-4" />
            <span className="absolute hidden group-hover:block -top-8 left-1/2 -translate-x-1/2 bg-wtf-bg text-wtf-light text-xs rounded py-1 px-2">
              Share
            </span>
          </button>
        </div>
      </div>

      {/* Story Title */}
      {story.title && (
        <h3 className="text-xl font-bold text-wtf-light mb-3">{story.title}</h3>
      )}

      {/* Story Content */}
      <p className="text-wtf-light/80 mb-4 leading-relaxed">{story.content}</p>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={handleUpvote}
          disabled={hasUpvoted}
          className={`btn-secondary ${hasUpvoted ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={hasUpvoted ? 'Already upvoted' : 'Upvote story'}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Upvote</span>
        </button>
        <button
          onClick={handleSimilar}
          className="btn-secondary"
          aria-label="Mark as similar"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Similar Story</span>
        </button>
      </div>

      {/* Reaction Buttons */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(reactionIcons).map(([reaction, { icon: Icon, color, label }]) => (
          <button
            key={reaction}
            onClick={() => handleReaction(reaction)}
            disabled={hasReacted[reaction]}
            className={`btn-icon relative group ${color} ${
              hasReacted[reaction] ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label={`React with ${label}`}
          >
            <Icon className="w-4 h-4" />
            <span className="ml-1 text-xs">{reactions[reaction]}</span>
            <span className="absolute hidden group-hover:block -top-8 left-1/2 -translate-x-1/2 bg-wtf-bg text-wtf-light text-xs rounded py-1 px-2">
              {label}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// Submit Story Component
const SubmitStory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tag: 'Other',
  });
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get('/tags');
      setTags(response.data.filter((tag) => tag !== 'all'));
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.content.trim().length < 10) {
      toast.error('Story must be at least 10 characters long');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/stories', formData);
      toast.success('Your WTF story has been shared!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit story');
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (e) => {
    const content = e.target.value;
    if (content.length <= 500) {
      setFormData((prev) => ({ ...prev, content }));
      setCharCount(content.length);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation showSubmit={false} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-8 animate-glow"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-wtf-light">Share Your WTF Moment</h1>
            <p className="text-wtf-light/70 mt-2">Anonymous, raw, and unfiltered. What just happened?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-wtf-light font-medium mb-2">
                Title (Optional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full"
                placeholder="Give your story a catchy title..."
                maxLength={100}
                aria-label="Story title"
              />
            </div>

            {/* Story Content */}
            <div>
              <label className="block text-wtf-light font-medium mb-2">
                Your Story *
              </label>
              <textarea
                value={formData.content}
                onChange={handleContentChange}
                className="w-full min-h-[150px] resize-none"
                placeholder="Tell us what happened... Don't hold back!"
                required
                aria-label="Story content"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-wtf-light/60 text-sm">
                  Be specific, be honest, be anonymous
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-1 bg-wtf-bg/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-wtf-primary transition-all duration-300"
                      style={{ width: `${(charCount / 500) * 100}%` }}
                    ></div>
                  </div>
                  <span
                    className={`text-sm ${
                      charCount > 450 ? 'text-wtf-warning' : 'text-wtf-light/60'
                    }`}
                  >
                    {charCount}/500
                  </span>
                </div>
              </div>
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block text-wtf-light font-medium mb-2">
                Category *
              </label>
              <select
                value={formData.tag}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tag: e.target.value }))
                }
                className="w-full"
                required
                aria-label="Story category"
              >
                {tags.map((tag) => (
                  <option key={tag} value={tag} className="bg-wtf-bg">
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || charCount < 10}
              className="btn-primary w-full justify-center"
              aria-label="Submit story"
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Share My WTF Story</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-wtf-bg/50 rounded-lg">
            <p className="text-wtf-light/60 text-sm">
              <strong>Remember:</strong> All stories are completely anonymous. No
              personal info is collected. Keep it real, keep it clean, and let the
              world know what just happened to you!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Story Page Component
const StoryPage = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    try {
      const response = await axios.get(`/stories/${id}`);
      setStory(response.data);
    } catch (error) {
      toast.error('Story not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-wtf-light mb-4">Story Not Found</h1>
          <Link to="/" className="btn-primary">
            Go back to stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StoryCard story={story} index={0} />
      </div>
    </div>
  );
};

// Admin Login Component
const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/admin/login', credentials);
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
      toast.success('Admin login successful');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-8 w-full max-w-md animate-glow"
      >
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-wtf-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-wtf-light">Admin Login</h1>
          <p className="text-wtf-light/70">Access the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-wtf-light font-medium mb-2">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials((prev) => ({ ...prev, username: e.target.value }))
              }
              className="w-full"
              required
              aria-label="Admin username"
            />
          </div>

          <div>
            <label className="block text-wtf-light font-medium mb-2">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full"
              required
              aria-label="Admin password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center"
            aria-label="Login to admin dashboard"
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <UserCheck className="w-5 h-5" />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-wtf-primary hover:text-wtf-secondary text-sm">
            Back to Stories
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

// Admin Dashboard Component
// Admin Dashboard Component
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stories, setStories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('stories');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (!token || !userData) {
      navigate('/admin');
      return;
    }

    setUser(JSON.parse(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    fetchStories();
    if (JSON.parse(userData).role === 'super-admin') {
      fetchStats();
    }
  }, [navigate, statusFilter]);

  const fetchStories = async () => {
    try {
      const response = await axios.get('/admin/stories', {
        params: { status: statusFilter, limit: 100 },
      });
      setStories(response.data.stories);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin');
      }
      toast.error('Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleStoryAction = async (storyId, action, value) => {
    try {
      if (action === 'delete') {
        await axios.delete(`/admin/stories/${storyId}`);
        setStories((prev) => prev.filter((s) => s.id !== storyId));
        toast.success('Story deleted');
      } else {
        await axios.patch(`/admin/stories/${storyId}`, { [action]: value });
        setStories((prev) =>
          prev.map((s) => (s.id === storyId ? { ...s, [action]: value } : s))
        );
        toast.success(`Story ${action} updated`);
      }
    } catch (error) {
      toast.error(`Failed to ${action} story`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wtf-dark">
      {/* Admin Header */}
      <div className="bg-wtf-dark sticky top-0 z-50 border-b border-wtf-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-wtf-primary" />
              <div>
                <h1 className="text-xl font-bold text-wtf-light">Admin Dashboard</h1>
                <p className="text-sm text-wtf-light/70">
                  Welcome back, {user?.username} ({user?.role})
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="btn-secondary">
                <Home className="w-4 h-4" />
                <span>Back to Site</span>
              </Link>
              <button onClick={handleLogout} className="btn-primary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 bg-wtf-bg/50 rounded-lg p-1">
          <button
            onClick={() => setCurrentTab('stories')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex-1 ${
              currentTab === 'stories'
                ? 'bg-wtf-primary text-wtf-dark'
                : 'text-wtf-light/70 hover:text-wtf-light hover:bg-wtf-bg'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>Manage Stories</span>
          </button>
          {user?.role === 'super-admin' && (
            <button
              onClick={() => setCurrentTab('stats')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex-1 ${
                currentTab === 'stats'
                  ? 'bg-wtf-primary text-wtf-dark'
                  : 'text-wtf-light/70 hover:text-wtf-light hover:bg-wtf-bg'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Statistics</span>
            </button>
          )}
        </div>

        {/* Stats Tab */}
        {currentTab === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: 'Total Stories',
                value: stats.totalStories,
                icon: Star,
                color: 'bg-wtf-primary',
              },
              {
                title: 'Last 24h',
                value: stats.storiesLast24h,
                icon: Clock,
                color: 'bg-wtf-success',
              },
              {
                title: 'Total Reactions',
                value: stats.totalReactions,
                icon: Heart,
                color: 'bg-wtf-secondary',
              },
              {
                title: 'Flagged Stories',
                value: stats.flaggedStories,
                icon: Flag,
                color: 'bg-wtf-danger',
              },
              {
                title: 'Total Visits',
                value: stats.totalVisits,
                icon: UserCheck,
                color: 'bg-wtf-accent',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 animate-glow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-wtf-light/70 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-wtf-light">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-wtf-dark" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stories Management Tab */}
        {currentTab === 'stories' && (
          <>
            <div className="flex space-x-2 mb-6 bg-wtf-bg/50 rounded-lg p-2">
              {['all', 'approved', 'pending', 'flagged'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`tag flex-1 ${statusFilter === status ? 'tag-active' : ''}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} Stories
                </button>
              ))}
            </div>
            <div className="space-y-6">
              {stories.map((story) => (
                <div key={story.id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="badge">#{story.tag}</span>
                        <span className="text-wtf-light/60 text-sm">
                          {new Date(story.createdAt).toLocaleString()}
                        </span>
                        <div className="flex items-center space-x-4 text-wtf-light/60 text-sm">
                          <span>{story.upvotes} upvotes</span>
                          <span>
                            {Object.values(story.reactions).reduce((a, b) => a + b, 0)} reactions
                          </span>
                        </div>
                      </div>
                      {story.title && (
                        <h3 className="text-lg font-bold text-wtf-light mb-2">{story.title}</h3>
                      )}
                      <p className="text-wtf-light/80 mb-4">{story.content}</p>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            story.approved
                              ? 'bg-wtf-success text-wtf-dark'
                              : 'bg-wtf-warning text-wtf-dark'
                          }`}
                        >
                          {story.approved ? 'Approved' : 'Pending'}
                        </span>
                        {story.flagged && (
                          <span className="bg-wtf-danger text-wtf-dark px-2 py-1 rounded text-xs">
                            Flagged
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      {!story.approved && (
                        <button
                          onClick={() => handleStoryAction(story.id, 'approved', true)}
                          className="btn-secondary bg-wtf-success hover:bg-wtf-success/80"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleStoryAction(story.id, 'flagged', !story.flagged)}
                        className={`btn-secondary ${
                          story.flagged
                            ? 'bg-wtf-success hover:bg-wtf-success/80'
                            : 'bg-wtf-warning hover:bg-wtf-warning/80'
                        }`}
                      >
                        <Flag className="w-3 h-3" />
                        <span>{story.flagged ? 'Unflag' : 'Flag'}</span>
                      </button>
                      <button
                        onClick={() => handleStoryAction(story.id, 'delete')}
                        className="btn-secondary bg-wtf-danger hover:bg-wtf-danger/80"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {stories.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-wtf-light/70">No stories found for the selected filter.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;