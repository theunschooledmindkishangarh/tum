import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Settings, 
  Image, 
  Video, 
  BookOpen, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  Github, 
  HelpCircle, 
  ArrowRight,
  Eye,
  Globe,
  Loader2
} from "lucide-react";
import { pushContentToGithub, GithubConfig, extractYoutubeId } from "../utils/githubService";

interface ControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onContentAdded: (type: "photo" | "video" | "blog", newItem: any) => void;
}

export default function ControlPanel({ isOpen, onClose, onContentAdded }: ControlPanelProps) {
  // Post Options State
  const [postType, setPostType] = useState<"photo" | "video" | "blog">("photo");
  
  // Photo Form State
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoDesc, setPhotoDesc] = useState("");
  const [photoCategory, setPhotoCategory] = useState<"Activity" | "Celebrations">("Activity");

  // Video Form State
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [videoDuration, setVideoDuration] = useState("5:00");
  const [videoCategory, setVideoCategory] = useState("Sovereign Mind");

  // Blog Form State
  const [blogTitle, setBlogTitle] = useState("");
  const [blogImageUrl, setBlogImageUrl] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCategory, setBlogCategory] = useState("Philosophy");
  const [blogAuthor, setBlogAuthor] = useState("Sovereign Guide");

  // GitHub Configurations State
  const [githubOwner, setGithubOwner] = useState(() => localStorage.getItem("gh_owner") || "");
  const [githubRepo, setGithubRepo] = useState(() => localStorage.getItem("gh_repo") || "");
  const [githubBranch, setGithubBranch] = useState(() => localStorage.getItem("gh_branch") || "main");
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem("gh_token") || "");
  
  // Collapse controller for connection settings
  const [showSettings, setShowSettings] = useState(false);
  
  // Status and feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | null; msg: string }>({
    type: null,
    msg: ""
  });

  // Keep settings synced with LocalStorage
  useEffect(() => {
    localStorage.setItem("gh_owner", githubOwner);
  }, [githubOwner]);

  useEffect(() => {
    localStorage.setItem("gh_repo", githubRepo);
  }, [githubRepo]);

  useEffect(() => {
    localStorage.setItem("gh_branch", githubBranch);
  }, [githubBranch]);

  useEffect(() => {
    localStorage.setItem("gh_token", githubToken);
  }, [githubToken]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ type: null, msg: "" });

    // Validation check per user requirements (All fields are required for selected option)
    if (postType === "photo") {
      if (!photoUrl.trim() || !photoTitle.trim()) {
        setFeedback({ type: "error", msg: "All Photo fields (Photo URL and Photo Title) are required!" });
        return;
      }
    } else if (postType === "video") {
      if (!videoUrl.trim() || !videoTitle.trim()) {
        setFeedback({ type: "error", msg: "All Video fields (Video URL and Video Title) are required!" });
        return;
      }
      // Check youtube URL format
      const isYoutube = extractYoutubeId(videoUrl);
      if (!isYoutube) {
        setFeedback({ type: "error", msg: "Invalid video URL! Please provide a valid YouTube Link (e.g. watch?v=... or share link)." });
        return;
      }
    } else if (postType === "blog") {
      if (!blogTitle.trim() || !blogImageUrl.trim() || !blogContent.trim()) {
        setFeedback({ 
          type: "error", 
          msg: "All Blog fields (Blog Title, Blog Image URL, and Blog Content) are required!" 
        });
        return;
      }
    }

    // Determine GitHub config
    const hasGithubConfig = githubOwner.trim() && githubRepo.trim() && githubBranch.trim() && githubToken.trim();

    // Prepare package payload
    let payload: any = {};
    if (postType === "photo") {
      payload = {
        url: photoUrl.trim(),
        title: photoTitle.trim(),
        desc: photoDesc.trim() || "Captured moment of self-directed play.",
        category: photoCategory
      };
    } else if (postType === "video") {
      payload = {
        url: videoUrl.trim(),
        title: videoTitle.trim(),
        description: videoDesc.trim() || "Watch our learning community in action.",
        duration: videoDuration.trim() || "3:00",
        category: videoCategory.trim() || "Sovereign Mind"
      };
    } else if (postType === "blog") {
      payload = {
        title: blogTitle.trim(),
        image: blogImageUrl.trim(),
        content: blogContent.trim(),
        category: blogCategory.trim() || "Philosophy",
        author: blogAuthor.trim() || "Sovereign Guide",
        snippet: blogContent.substring(0, 150) + "..."
      };
    }

    if (!hasGithubConfig) {
      // Suggest writing locally since GitHub configuration is missing
      setIsSubmitting(true);
      setTimeout(() => {
        onContentAdded(postType, payload);
        setIsSubmitting(false);
        setFeedback({
          type: "success",
          msg: `Success! Posted in 'Local Preview Mode'. Since GitHub Connection is not configured, the changes are stored in your browser's local state. Tap 'GitHub Settings' below to connect your real repo and update GitHub Pages!`
        });
        // Clear forms
        clearForm();
      }, 700);
      return;
    }

    // Connect & Write to GitHub Repo
    setIsSubmitting(true);
    const config: GithubConfig = {
      owner: githubOwner.trim(),
      repo: githubRepo.trim(),
      branch: githubBranch.trim(),
      token: githubToken.trim()
    };

    try {
      const response = await pushContentToGithub(config, postType, payload);
      
      if (response.success) {
        // Update local React state so they see it instantly!
        onContentAdded(postType, payload);
        setFeedback({
          type: "success",
          msg: response.message
        });
        clearForm();
      } else {
        setFeedback({
          type: "error",
          msg: `GitHub post failed: ${response.message}`
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        msg: `Error posting: ${err.message || "An unexpected network error occurred."}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    // Clear form states
    setPhotoUrl("");
    setPhotoTitle("");
    setPhotoDesc("");
    setVideoUrl("");
    setVideoTitle("");
    setVideoDesc("");
    setBlogTitle("");
    setBlogImageUrl("");
    setBlogContent("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Background Dim Backdrop Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-green/45 backdrop-blur-sm"
      />

      {/* Main Panel Content Dialog Box */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="bg-brand-sand border-3 border-brand-green w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-[8px_8px_0px_0px_var(--color-brand-green)] relative z-110 flex flex-col font-rounded text-brand-green text-sm"
      >
        
        {/* Header Header */}
        <div className="p-5 border-b-2 border-brand-green/10 flex items-center justify-between sticky top-0 bg-brand-sand z-10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-brand-yellow border-2 border-brand-green text-brand-green">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </span>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Makerspace Portal</h2>
              <p className="text-[10px] text-brand-green/65 font-medium">Control panel to post live photos, videos, and journals</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border-2 border-brand-green/20 hover:border-brand-green hover:bg-white text-brand-green transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-6">
          
          {/* Top Choice Section */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-xs uppercase tracking-wide text-brand-green/70">
              Choose Your Post Type *
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-brand-sand border-2 border-brand-green rounded-xl">
              <button
                type="button"
                onClick={() => { setPostType("photo"); setFeedback({ type: null, msg: "" }); }}
                className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  postType === "photo" 
                    ? "bg-brand-clay text-white border border-brand-green shadow-inner" 
                    : "hover:bg-brand-green/5 bg-transparent border border-transparent"
                }`}
              >
                <Image className="w-4 h-4" />
                <span>Photo</span>
              </button>

              <button
                type="button"
                onClick={() => { setPostType("video"); setFeedback({ type: null, msg: "" }); }}
                className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  postType === "video" 
                    ? "bg-brand-green text-white border border-brand-green shadow-inner" 
                    : "hover:bg-brand-green/5 bg-transparent border border-transparent"
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video</span>
              </button>

              <button
                type="button"
                onClick={() => { setPostType("blog"); setFeedback({ type: null, msg: "" }); }}
                className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  postType === "blog" 
                    ? "bg-brand-yellow text-brand-green border border-brand-green shadow-inner" 
                    : "hover:bg-brand-green/5 bg-transparent border border-transparent"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Blog</span>
              </button>
            </div>
          </div>

          {/* Feedback Status Box */}
          {feedback.type && (
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-4 rounded-xl border-2 flex items-start gap-3 ${
                feedback.type === "success" 
                  ? "bg-green-50 border-green-500/30 text-green-800" 
                  : "bg-red-50 border-red-500/30 text-red-800"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <p className="text-xs font-semibold leading-relaxed">{feedback.msg}</p>
            </motion.div>
          )}

          {/* Interactive Form Context */}
          <form onSubmit={handlePost} className="flex flex-col gap-4 font-semibold text-xs">
            
            {/* PHOTO FIELDS */}
            {postType === "photo" && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="photoUrl">Photo URL *</label>
                  <input
                    type="url"
                    id="photoUrl"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="p-3 border-2 border-brand-green rounded-xl bg-white focus:outline-none focus:border-brand-clay"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="photoTitle">Photo Title *</label>
                  <input
                    type="text"
                    id="photoTitle"
                    placeholder="e.g. Carpentry Masterclass"
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                    className="p-3 border-2 border-brand-green rounded-xl bg-white focus:outline-none focus:border-brand-clay"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="photoCategory">Gallery Tab Category</label>
                    <select
                      id="photoCategory"
                      value={photoCategory}
                      onChange={(e) => setPhotoCategory(e.target.value as "Activity" | "Celebrations")}
                      className="p-3 border-2 border-brand-green rounded-xl bg-white focus:outline-none focus:border-brand-clay font-bold text-xs"
                    >
                      <option value="Activity">Active Daily Learning</option>
                      <option value="Celebrations">Celebrations & Assemblies</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="photoDesc">Photo Description (Optional)</label>
                    <input
                      type="text"
                      id="photoDesc"
                      placeholder="e.g. Practicing self-guided angles and balancing weights"
                      value={photoDesc}
                      onChange={(e) => setPhotoDesc(e.target.value)}
                      className="p-3 border-2 border-brand-green rounded-xl bg-white focus:outline-none focus:border-brand-clay"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIDEO FIELDS */}
            {postType === "video" && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="videoUrl">YouTube Video URL *</label>
                  <input
                    type="url"
                    id="videoUrl"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="p-3 border-2 border-brand-green rounded-xl bg-white focus:outline-none focus:border-brand-clay"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="videoTitle">Video Title *</label>
                  <input
                    type="text"
                    id="videoTitle"
                    placeholder="e.g. Free-play sandbox research"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="p-3 border-2 border-brand-green rounded-xl bg-white focus:outline-none focus:border-brand-clay"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="videoCategory">Sub-category</label>
                    <input
                      type="text"
                      id="videoCategory"
                      placeholder="e.g. Makerspace Bio"
                      value={videoCategory}
                      onChange={(e) => setVideoCategory(e.target.value)}
                      className="p-3 border-2 border-brand-green rounded-xl bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="videoDuration">Duration</label>
                    <input
                      type="text"
                      id="videoDuration"
                      placeholder="e.g. 14:05"
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(e.target.value)}
                      className="p-3 border-2 border-brand-green rounded-xl bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="videoDesc">Video Description (Optional)</label>
                  <textarea
                    id="videoDesc"
                    rows={2}
                    placeholder="Describe what the video portrays..."
                    value={videoDesc}
                    onChange={(e) => setVideoDesc(e.target.value)}
                    className="p-3 border-2 border-brand-green rounded-xl bg-white focus:outline-none focus:border-brand-clay resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* BLOG FIELDS */}
            {postType === "blog" && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="blogTitle">Blog Title *</label>
                  <input
                    type="text"
                    id="blogTitle"
                    placeholder="e.g. Raising Thinkers: Our Core Assemblies"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    className="p-3 border-2 border-brand-green rounded-xl bg-white focus:outline-none focus:border-brand-clay"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="blogImageUrl">Blog Cover Image URL *</label>
                  <input
                    type="url"
                    id="blogImageUrl"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={blogImageUrl}
                    onChange={(e) => setBlogImageUrl(e.target.value)}
                    className="p-3 border-2 border-brand-green rounded-xl bg-white focus:outline-none focus:border-brand-clay"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="blogAuthor">Author</label>
                    <input
                      type="text"
                      id="blogAuthor"
                      value={blogAuthor}
                      onChange={(e) => setBlogAuthor(e.target.value)}
                      className="p-3 border-2 border-brand-green rounded-xl bg-white focus:outline-none focus:border-brand-clay"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="blogCategory">Category</label>
                    <input
                      type="text"
                      id="blogCategory"
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      className="p-3 border-2 border-brand-green rounded-xl bg-white focus:outline-none focus:border-brand-clay"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="blogContent">Blog Content *</label>
                  <textarea
                    id="blogContent"
                    rows={5}
                    placeholder="Write the full markdown or plain text blog article..."
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    className="p-3 border-2 border-brand-green rounded-xl bg-white focus:outline-none focus:border-brand-clay resize-y min-h-[140px]"
                  />
                </div>
              </motion.div>
            )}

            {/* Core Action Trigger buttons */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 px-6 rounded-xl text-white font-extrabold text-sm border-2 border-brand-green bg-brand-green flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_var(--color-brand-clay)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Committing Live to GitHub...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5 text-brand-yellow" />
                    <span>Post New {postType === "photo" ? "Photo" : postType === "video" ? "Video" : "Blog"}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={`py-3 px-4 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  showSettings || (!githubOwner || !githubRepo || !githubToken)
                    ? "bg-brand-yellow/10 border-brand-yellow text-brand-green shadow-sm"
                    : "bg-white border-brand-green/20 text-brand-green hover:border-brand-green"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>GitHub Settings</span>
                {(!githubOwner || !githubRepo || !githubToken) && (
                  <span className="w-2 h-2 rounded-full bg-brand-clay animate-ping" />
                )}
              </button>
            </div>

          </form>

          {/* Collapsible GitHub Settings Area */}
          <AnimatePresence>
            {(showSettings || (!githubOwner || !githubRepo || !githubToken)) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-[#EEF2FF] border-2 border-brand-green/30 p-4 rounded-xl flex flex-col gap-4 font-semibold text-xs"
              >
                <div className="flex items-center gap-2 border-b border-brand-green/10 pb-2">
                  <Github className="w-4 h-4" />
                  <h4 className="font-extrabold text-xs uppercase tracking-wider">GitHub Pages live deployment integration</h4>
                  <span className="ml-auto text-[10px] bg-brand-clay/10 text-brand-clay py-0.5 px-2 rounded-full border border-brand-clay/20 font-mono">
                    {githubOwner && githubRepo && githubToken ? "Connected" : "Preview Mode Only"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="ghOwner">GitHub Username / Owner</label>
                    <input
                      type="text"
                      id="ghOwner"
                      placeholder="e.g. theunschooledmindkishangarh"
                      value={githubOwner}
                      onChange={(e) => setGithubOwner(e.target.value)}
                      className="p-2 border border-brand-green/40 rounded-lg bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="ghRepo">Repo Name</label>
                    <input
                      type="text"
                      id="ghRepo"
                      placeholder="e.g. final-site"
                      value={githubRepo}
                      onChange={(e) => setGithubRepo(e.target.value)}
                      className="p-2 border border-brand-green/40 rounded-lg bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="ghBranch">Target deployment branch</label>
                    <input
                      type="text"
                      id="ghBranch"
                      placeholder="main"
                      value={githubBranch}
                      onChange={(e) => setGithubBranch(e.target.value)}
                      className="p-2 border border-brand-green/40 rounded-lg bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="ghToken" className="flex items-center gap-1">
                      <Key className="w-3 h-3 text-brand-clay" />
                      <span>Personal Access Token (PAT)</span>
                    </label>
                    <p className="text-[10px] text-brand-green/50 font-normal">Stored safely inside your own browser localStorage</p>
                  </div>
                  <input
                    type="password"
                    id="ghToken"
                    placeholder="github_pat_..."
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="p-2 border border-brand-green/40 rounded-lg bg-white focus:outline-none tracking-widest font-mono text-xs"
                  />
                </div>

                <div className="p-3 bg-white border border-brand-green/10 rounded-lg flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-brand-clay shrink-0 mt-0.5" />
                  <div className="font-normal text-[10px] leading-relaxed text-brand-green/75 flex flex-col gap-1">
                    <p>
                      <strong>How to configure this portal:</strong> To automatically push new elements onto your direct GitHub Pages static address, you need to create a classic <strong>Personal Access Token (PAT)</strong> with <code>repo</code> write scopes from your GitHub settings profile.
                    </p>
                    <p className="font-semibold text-brand-clay">
                      💡 Tip: If you check out without completing this settings block, the portal operates in 'Preview-Mode', tracking and showing elements strictly in your local browser tab!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </motion.div>
    </div>
  );
}
