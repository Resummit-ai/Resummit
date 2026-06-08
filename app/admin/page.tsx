"use client";

import { useEffect, useState } from "react";
import { Mail, Users, Send, AlertCircle, CheckCircle, Search, Calendar, ChevronRight, ShieldAlert, Eye, Loader2 } from "lucide-react";
import Link from "next/link";

interface UserItem {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: string;
  githubUsername: string | null;
}

export default function AdminDashboard() {
  const [sessionLoading, setSessionLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Email Form State
  const [subject, setSubject] = useState("New update from Resummit 🚀");
  const [htmlContent, setHtmlContent] = useState(
    `<h1>Hey there!</h1>\n<p>We've just rolled out some exciting updates to Resummit...</p>`
  );
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number; error?: string } | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    // Check if the current user is an admin
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/send-update");
        if (res.status === 200) {
          setIsAdmin(true);
          const data = await res.json();
          const loadedUsers = data.users || [];
          setUsers(loadedUsers);
          setSelectedUserIds(loadedUsers.map((u: UserItem) => u.id));
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        setIsAdmin(false);
      } finally {
        setSessionLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(`Are you sure you want to send this email to all ${users.length} users?`)) {
      return;
    }

    setSending(true);
    setSendResult(null);

    try {
      const res = await fetch("/api/admin/send-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, html: htmlContent, userIds: selectedUserIds }),
      });

      const data = await res.json();
      if (res.ok) {
        setSendResult({ sent: data.sent, failed: data.failed });
      } else {
        setSendResult({ sent: 0, failed: users.length, error: data.error || "Failed to send emails" });
      }
    } catch (err: any) {
      setSendResult({ sent: 0, failed: users.length, error: err.message || "An unexpected error occurred" });
    } finally {
      setSending(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.githubUsername?.toLowerCase().includes(q)
    );
  });

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[var(--sclade-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Verifying Admin DNA...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--sclade-bg)] flex items-center justify-center p-6">
        <div className="max-w-md w-full glass-panel p-8 rounded-[2rem] border border-red-500/20 bg-red-500/[0.02] text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6 animate-pulse" />
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-neutral-400 text-sm leading-relaxed mb-6">
            This terminal requires admin-level privileges. If you are the administrator, please ensure you are logged in with the registered admin email.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--sclade-bg)] text-[var(--sclade-text-primary)] font-outfit p-8 md:p-16">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[var(--sclade-card-border)]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] uppercase font-bold tracking-widest mb-4">
              Control Panel
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Admin Update Center</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2 font-light">
              Broadcast product announcements and manage subscribers.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="self-start md:self-auto px-5 py-3 border border-[var(--sclade-card-border)] bg-[var(--sclade-btn-secondary-bg)] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[var(--sclade-card-bg)] transition-all flex items-center gap-2"
          >
            ← Back to Dashboard
          </Link>
        </header>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-wider block">Total Registered Users</span>
              <span className="text-3xl font-bold mt-1 block">{users.length}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-wider block">Mailing Service</span>
              <span className="text-sm font-bold text-emerald-400 mt-2 block">Resend API Connected</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Email Composer (Left Column) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-8 rounded-[2rem] bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)]">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                Compose Announcement
              </h3>

              <form onSubmit={handleSend} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-2">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject..."
                    className="w-full px-4 py-3.5 bg-black/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-xl text-sm outline-none focus:border-blue-500/50 transition-all font-semibold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                      Email Body (HTML)
                    </label>
                    <button
                      type="button"
                      onClick={() => setPreviewMode(!previewMode)}
                      className="text-[10px] font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {previewMode ? "Edit Code" : "Preview Visual"}
                    </button>
                  </div>

                  {previewMode ? (
                    <div 
                      className="w-full min-h-[300px] p-6 bg-white text-black rounded-xl border border-black/5 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  ) : (
                    <textarea
                      required
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      placeholder="<h1>Hi!</h1>..."
                      rows={12}
                      className="w-full px-4 py-4 bg-black/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-xl text-sm font-mono outline-none focus:border-blue-500/50 transition-all leading-relaxed"
                    />
                  )}
                </div>

                {sendResult && (
                  <div className={`p-4 rounded-xl border ${
                    sendResult.error 
                      ? "bg-red-500/5 border-red-500/10 text-red-400" 
                      : "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"
                  }`}>
                    <div className="flex items-start gap-3">
                      {sendResult.error ? (
                        <AlertCircle className="w-5 h-5 mt-0.5" />
                      ) : (
                        <CheckCircle className="w-5 h-5 mt-0.5" />
                      )}
                      <div>
                        <span className="text-xs font-bold block">
                          {sendResult.error ? "Failed to dispatch emails" : "Broadcast Dispatched successfully"}
                        </span>
                        {sendResult.error ? (
                          <p className="text-[10px] opacity-80 mt-1 font-semibold">{sendResult.error}</p>
                        ) : (
                          <p className="text-[10px] opacity-80 mt-1 font-semibold">
                            Sent to {sendResult.sent} users. Failures: {sendResult.failed}.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending || selectedUserIds.length === 0}
                  className="w-full py-4.5 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-600/10 transition-all cursor-pointer"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Dispatching Batch...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send to {selectedUserIds.length} selected users
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* User Directory (Right Column) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-8 rounded-[2rem] bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] flex flex-col max-h-[640px]">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-violet-400" />
                    User Registry
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUserIds(users.map(u => u.id))}
                      className="text-[9px] font-black uppercase tracking-wider text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-neutral-600 text-[9px]">|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedUserIds([])}
                      className="text-[9px] font-black uppercase tracking-wider text-neutral-500 hover:text-neutral-400 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-4.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, github..."
                    className="w-full pl-11 pr-4 py-3 bg-black/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-xl text-xs outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              {/* User List Scrollable */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                    No users found
                  </div>
                ) : (
                  filteredUsers.map((u) => (
                    <div
                      key={u.id}
                      className={`p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.01] border transition-all flex justify-between items-center ${
                        selectedUserIds.includes(u.id)
                          ? "border-blue-500/30 bg-blue-500/[0.01]"
                          : "border-black/5 dark:border-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(u.id)}
                          onChange={() => {
                            setSelectedUserIds(prev =>
                              prev.includes(u.id)
                                ? prev.filter(id => id !== u.id)
                                : [...prev, u.id]
                            );
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block truncate">
                            {u.name || "Anonymous User"}
                          </span>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block truncate font-semibold">
                            {u.email}
                          </span>
                          {u.githubUsername && (
                            <span className="inline-block px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                              github: {u.githubUsername}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-[9px] text-neutral-400 dark:text-neutral-600 font-bold uppercase tracking-wide flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(u.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
