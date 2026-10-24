"use client";

import { useEffect, useState } from "react";
import { Mail, Users, Send, AlertCircle, CheckCircle, Search, Calendar, ChevronRight, ShieldAlert, Eye, Loader2, Moon, Sun, ArrowLeft, Shield } from "lucide-react";
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
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("sclade-theme");
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("sclade-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("sclade-theme", "light");
    }
  };

  // Email Form State
  const [subject, setSubject] = useState("Your Workspace Just Got Better 🚀");
  const [htmlContent, setHtmlContent] = useState(
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Workspace Just Got Better</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 50px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; box-shadow: 0 15px 35px rgba(15, 23, 42, 0.04);">
          
          <!-- HERO SECTION -->
          <tr>
            <td style="padding: 70px 40px; text-align: center; background: linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #312e81 100%);">
              
              <!-- Logo Header -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 30px auto;">
                <tr>
                  <td style="vertical-align: middle;">
                    <!-- SVG Logo matching dark theme contrast -->
                    <svg width="34" height="34" viewBox="0 0 32 32" fill="none" style="display: block;">
                      <!-- Document Body (Deep Navy Fill, Blue Outline) -->
                      <path d="M7 6C7 4.34315 8.34315 3 10 3H19L25 9V26C25 27.6569 23.6569 29 22 29H10C8.34315 29 7 27.6569 7 26V6Z" fill="#172554" stroke="#60a5fa" stroke-width="1.5" />
                      <!-- Document Fold -->
                      <path d="M19 3V9H25L19 3Z" fill="#1d4ed8" />
                      <!-- Document Text Lines (White) -->
                      <path d="M11 13H17M11 17H21M11 21H18" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
                    </svg>
                  </td>
                  <td style="vertical-align: middle; padding-left: 12px;">
                    <span style="font-size: 22px; font-weight: 900; letter-spacing: .08em; color: #ffffff;">
                      RESUMMIT<span style="font-size: 10px; font-weight: 900; background: linear-gradient(135deg, #3b82f6, #6366f1); color: #ffffff; padding: 2px 6px; border-radius: 4px; margin-left: 6px; vertical-align: middle; display: inline-block;">AI</span>
                    </span>
                  </td>
                </tr>
              </table>

              <h1 style="margin: 0 0 18px 0; font-size: 38px; font-weight: 900; line-height: 1.15; letter-spacing: -0.04em; color: #ffffff;">
                Your Workspace<br>Just Got Better.
              </h1>

              <p style="margin: 0 auto; max-width: 470px; color: #cbd5e1; font-size: 16px; line-height: 28px; font-weight: 500;">
                Manage multiple resumes, optimize versions independently, and track ATS insights from a single streamlined workspace.
              </p>

            </td>
          </tr>

          <!-- CONTENT SECTION -->
          <tr>
            <td style="padding: 50px 40px 40px 40px;">

              <!-- INTRO -->
              <p style="margin: 0 0 34px 0; font-size: 15px; line-height: 26px; color: #64748b; text-align: center; font-weight: 500;">
                We've rolled out a major workspace update designed to make resume tailoring faster, cleaner, and easier to manage.
              </p>

              <!-- SCREENSHOT PLACEHOLDER (Interactive Workspace CSS Mockup) -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 36px; border-radius: 22px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 20px 50px rgba(15,23,42,.08);">
                <tr>
                  <td style="padding: 22px; background: linear-gradient(180deg, #f8fafc, #ffffff);">
                    
                    <div style="font-size: 11px; font-weight: 800; color: #94a3b8; margin-bottom: 16px; letter-spacing: 0.1em; text-transform: uppercase;">
                      NEW WORKSPACE
                    </div>

                    <!-- CSS 3-Pane Layout Simulator -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #c7d2fe; overflow: hidden;">
                      <tr>
                        <!-- Left Sidebar (Editor Tabs) -->
                        <td width="30%" style="background-color: #f1f5f9; padding: 16px 12px; border-right: 1px solid #e2e8f0; vertical-align: top;">
                          <div style="width: 14px; height: 14px; background-color: #2563eb; border-radius: 4px; margin-bottom: 16px;"></div>
                          <div style="height: 6px; background-color: #cbd5e1; border-radius: 3px; width: 75%; margin-bottom: 10px;"></div>
                          <div style="height: 6px; background-color: #e2e8f0; border-radius: 3px; width: 90%; margin-bottom: 10px;"></div>
                          <div style="height: 6px; background-color: #e2e8f0; border-radius: 3px; width: 55%; margin-bottom: 10px;"></div>
                        </td>
                        <!-- Middle Section (Resume Page Preview) -->
                        <td width="45%" style="background-color: #ffffff; padding: 20px 16px; vertical-align: top; text-align: left;">
                          <div style="height: 10px; background-color: #0f172a; border-radius: 3px; width: 65%; margin-bottom: 8px;"></div>
                          <div style="height: 6px; background-color: #64748b; border-radius: 2px; width: 45%; margin-bottom: 16px;"></div>
                          <div style="height: 1px; background-color: #f1f5f9; margin-bottom: 16px;"></div>
                          <div style="height: 4px; background-color: #e2e8f0; border-radius: 2px; width: 100%; margin-bottom: 8px;"></div>
                          <div style="height: 4px; background-color: #e2e8f0; border-radius: 2px; width: 90%; margin-bottom: 8px;"></div>
                          <div style="height: 4px; background-color: #e2e8f0; border-radius: 2px; width: 100%; margin-bottom: 8px;"></div>
                        </td>
                        <!-- Right Sidebar (Versions Panel) -->
                        <td width="25%" style="background-color: #f8fafc; padding: 16px 12px; border-left: 1px solid #e2e8f0; vertical-align: top; text-align: left;">
                          <div style="height: 6px; background-color: #94a3b8; border-radius: 3px; width: 85%; margin-bottom: 14px;"></div>
                          <!-- Versions list mockup -->
                          <div style="padding: 6px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; margin-bottom: 6px;">
                            <div style="height: 4px; background-color: #2563eb; border-radius: 2px; width: 80%;"></div>
                          </div>
                          <div style="padding: 6px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 6px;">
                            <div style="height: 4px; background-color: #64748b; border-radius: 2px; width: 70%;"></div>
                          </div>
                          <div style="padding: 6px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px;">
                            <div style="height: 4px; background-color: #64748b; border-radius: 2px; width: 60%;"></div>
                          </div>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- FEATURE 1 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px; border-radius: 18px; border: 1px solid #e0e7ff; background: linear-gradient(135deg, rgba(255,255,255,.95), rgba(248,250,252,1)); box-shadow: 0 10px 30px rgba(99,102,241,.08);">
                <tr>
                  <td style="padding: 24px;">
                    <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
                      🗂 Multiple Targeted CV Drafts
                    </div>
                    <div style="font-size: 13.5px; line-height: 22px; color: #64748b; font-weight: 500;">
                      Targeting Frontend, Backend, or Lead roles? Clone your profile to create separate tailored versions in one click, keeping all draft templates saved under one workspace.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- FEATURE 2 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px; border-radius: 18px; border: 1px solid #e0e7ff; background: linear-gradient(135deg, rgba(255,255,255,.95), rgba(248,250,252,1)); box-shadow: 0 10px 30px rgba(99,102,241,.08);">
                <tr>
                  <td style="padding: 24px;">
                    <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
                      ⚡ In-Place Job Match Optimization
                    </div>
                    <div style="font-size: 13.5px; line-height: 22px; color: #64748b; font-weight: 500;">
                      Match your resume to any job description on the fly. Run the AI optimizer directly on an existing version to update it in-place, without creating duplicates.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- FEATURE 3 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px; border-radius: 18px; border: 1px solid #e0e7ff; background: linear-gradient(135deg, rgba(255,255,255,.95), rgba(248,250,252,1)); box-shadow: 0 10px 30px rgba(99,102,241,.08);">
                <tr>
                  <td style="padding: 24px;">
                    <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
                      📊 Real-Time ATS & Keyword Insights
                    </div>
                    <div style="font-size: 13.5px; line-height: 22px; color: #64748b; font-weight: 500;">
                      Get instant visual feedback on missing tech skills, matched keywords, and overall ATS strength score calculations inside every active version.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
                <tr>
                  <td align="center">
                    <a href="https://resummit.vercel.app/editor" style="display: inline-block; padding: 18px 42px; border-radius: 12px; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #ffffff; font-size: 14.5px; font-weight: 800; text-decoration: none; box-shadow: 0 15px 30px rgba(99,102,241,.3);">
                      Tailor Your Resume Now →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
          
          <!-- FOOTER -->
          <tr>
            <td style="padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; background-color: #fafafa;">
              <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: #94a3b8;">
                TAILOR ONCE. IMPROVE FOREVER.
              </p>
              <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 500;">
                Sent with ♥ from <a href="https://resummit.vercel.app" style="color: #475569; text-decoration: none; font-weight: 600;">Resummit</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>

</body>
</html>`
  );
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number; error?: string; results?: any[] } | null>(null);
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
    if (!confirm(`Are you sure you want to send this email to the ${selectedUserIds.length} selected users?`)) {
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
        setSendResult({ sent: data.sent, failed: data.failed, results: data.results });
      } else {
        setSendResult({ sent: 0, failed: selectedUserIds.length, error: data.error || "Failed to send emails" });
      }
    } catch (err: any) {
      setSendResult({ sent: 0, failed: selectedUserIds.length, error: err.message || "An unexpected error occurred" });
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
      <div className="min-h-screen dashboard-root text-[#171717] dark:text-[#f2efe9] flex items-center justify-center p-6">
        <style>{`
          .dashboard-root {
            background-color: #F5F5F3;
            background-image: radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px);
            background-size: 20px 20px;
          }
          .dark .dashboard-root,
          [data-theme="dark"] .dashboard-root {
            background-color: #0a0a0a;
            background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
            background-size: 20px 20px;
          }
        `}</style>
        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/95 dark:bg-[#141417]/95 border border-[#E5E5E5] dark:border-[#27272a] shadow-xs">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-neutral-400 font-bold">Verifying Admin DNA...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen dashboard-root text-[#171717] dark:text-[#f2efe9] flex items-center justify-center p-6">
        <style>{`
          .dashboard-root {
            background-color: #F5F5F3;
            background-image: radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px);
            background-size: 20px 20px;
          }
          .dark .dashboard-root,
          [data-theme="dark"] .dashboard-root {
            background-color: #0a0a0a;
            background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
            background-size: 20px 20px;
          }
        `}</style>
        <div className="max-w-md w-full p-8 rounded-2xl bg-white/95 dark:bg-[#141417]/95 border border-red-500/20 shadow-xs text-center">
          <ShieldAlert className="w-14 h-14 text-red-500 mx-auto mb-5" />
          <h1 className="text-2xl font-extrabold text-red-600 dark:text-red-400 mb-2">Access Denied</h1>
          <p className="text-slate-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
            This terminal is restricted exclusively to the system administrator. If this is your application, ensure you are signed in with your registered admin email.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xs"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-root text-[#171717] dark:text-[#f2efe9] selection:bg-neutral-800 selection:text-white font-sans antialiased transition-colors duration-300">
      <style>{`
        .dashboard-root {
          background-color: #F5F5F3;
          background-image: radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .dark .dashboard-root,
        [data-theme="dark"] .dashboard-root {
          background-color: #0a0a0a;
          background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>

      {/* Top Nav matching Dashboard Theme */}
      <nav className="relative z-50 border-b border-[#E5E5E5] dark:border-[#27272a] bg-[#F5F5F3]/85 dark:bg-[#0a0a0a]/85 backdrop-blur-xl sticky top-0 transition-colors duration-200 px-3.5 sm:px-6 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-10">
            <Link
              href="/"
              className="logo scale-90 origin-left cursor-pointer hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 32 32" className="logo-icon-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 6C7 4.34315 8.34315 3 10 3H19L25 9V26C25 27.6569 23.6569 29 22 29H10C8.34315 29 7 27.6569 7 26V6Z" className="logo-doc-body" />
                <path d="M19 3V9H25L19 3Z" className="logo-doc-fold" />
                <path d="M11 13H17M11 17H21M11 21H18M11 25H20" className="logo-doc-lines" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 8.5L25 3.5" className="logo-flag-pole" strokeWidth="2" strokeLinecap="round" />
                <path d="M25 3.5L27 6.5L23.5 5.5Z" className="logo-flag-banner" />
              </svg>
              <div className="logo-text-group">
                <div className="logo-wordmark">RESUMMIT</div>
                <div className="logo-tagline hidden sm:block">YOUR CAREER. YOUR CONTROL.</div>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-neutral-400">
              <Link href="/dashboard" className="hover:text-[#171717] dark:hover:text-[#f2efe9] transition-colors">Dashboard</Link>
              <Link href="/editor" className="hover:text-[#171717] dark:hover:text-[#f2efe9] transition-colors">Resume Editor</Link>
              <Link href="/admin" className="text-blue-600 dark:text-[#0099ff] border-b-2 border-blue-600 dark:border-[#0099ff] pb-1 -mb-[18px]">Admin</Link>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-lg border border-[#E5E5E5] dark:border-[#27272a] bg-white/95 dark:bg-[#141417]/95 hover:bg-[#E7EDFF] hover:border-[#CFD9FF] hover:text-[#5473D1] transition-all text-slate-600 dark:text-neutral-400 cursor-pointer"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E5E5] dark:border-[#27272a] bg-white/95 dark:bg-[#141417]/95 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold transition-all shadow-xs text-slate-700 dark:text-neutral-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-6 md:py-10 space-y-6 md:space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5] dark:border-[#27272a]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-[11px] uppercase font-bold tracking-wider mb-2">
              <Shield className="w-3 h-3" />
              <span>Superadmin Control Terminal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] dark:text-[#f2efe9]">
              Admin Operations Center
            </h1>
            <p className="text-slate-600 dark:text-neutral-400 mt-1 font-normal text-xs sm:text-sm">
              Broadcast product announcements, manage email campaigns, and inspect platform accounts.
            </p>
          </div>
        </header>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#141417]/95 border border-[#E5E5E5] dark:border-[#27272a] flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block">Total Registered Users</span>
              <span className="text-3xl font-extrabold text-[#171717] dark:text-[#f2efe9] mt-1 block">{users.length}</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#141417]/95 border border-[#E5E5E5] dark:border-[#27272a] flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block">Mailing Gateway</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-2 block flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Resend / SMTP Ready
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Mail className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#141417]/95 border border-[#E5E5E5] dark:border-[#27272a] flex items-center justify-between shadow-xs sm:col-span-2 md:col-span-1">
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block">System Authority</span>
              <span className="text-sm font-bold text-blue-600 dark:text-[#0099ff] mt-2 block truncate">
                adelmuhammed786@gmail.com
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

          {/* Email Composer (Left Column) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-white/95 dark:bg-[#141417]/95 border border-[#E5E5E5] dark:border-[#27272a] shadow-xs">
              <h3 className="text-base font-bold mb-5 flex items-center gap-2 text-[#171717] dark:text-[#f2efe9]">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Compose Announcement</span>
              </h3>

              <form onSubmit={handleSend} className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 block mb-1.5">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject..."
                    className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-[#E5E5E5] dark:border-[#27272a] text-[#171717] dark:text-[#f2efe9] rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                      Email Body (HTML)
                    </label>
                    <button
                      type="button"
                      onClick={() => setPreviewMode(!previewMode)}
                      className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{previewMode ? "Edit Code" : "Preview Visual"}</span>
                    </button>
                  </div>

                  {previewMode ? (
                    <div
                      className="w-full min-h-[300px] p-6 bg-white text-black rounded-xl border border-[#E5E5E5] overflow-y-auto max-h-[460px]"
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  ) : (
                    <textarea
                      required
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      placeholder="<h1>Hi!</h1>..."
                      rows={12}
                      className="w-full px-3.5 py-3 bg-neutral-50 dark:bg-neutral-900 border border-[#E5E5E5] dark:border-[#27272a] text-[#171717] dark:text-[#f2efe9] rounded-xl text-xs font-mono outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all leading-relaxed"
                    />
                  )}

                  {sendResult && (
                    <div className={`p-4 mt-5 rounded-xl border ${sendResult.error
                      ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                      }`}>
                      <div className="flex items-start gap-3">
                        {sendResult.error ? (
                          <AlertCircle className="w-5 h-5 mt-0.5 text-red-500 shrink-0" />
                        ) : (
                          <CheckCircle className="w-5 h-5 mt-0.5 text-emerald-600 shrink-0" />
                        )}
                        <div>
                          <span className="text-xs font-bold block">
                            {sendResult.error ? "Failed to dispatch emails" : "Broadcast Dispatched"}
                          </span>
                          {sendResult.error ? (
                            <p className="text-[11px] opacity-80 mt-1 font-semibold">{sendResult.error}</p>
                          ) : (
                            <div>
                              <p className="text-[11px] opacity-80 mt-1 font-semibold">
                                Sent to {sendResult.sent} users. Failures: {sendResult.failed}.
                              </p>
                              {sendResult.failed > 0 && sendResult.results && (
                                <div className="mt-3 text-[10px] space-y-1 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 max-h-32 overflow-y-auto">
                                  <span className="font-bold block text-red-600">SMTP Error Log:</span>
                                  {Array.from(new Set(sendResult.results.filter(r => !r.success).map(r => r.error))).map((err, i) => (
                                    <p key={i} className="font-mono text-red-700 break-all">{err || "Unknown error"}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={sending || selectedUserIds.length === 0}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Dispatching Batch...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send to {selectedUserIds.length} selected users</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* User Directory (Right Column) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-white/95 dark:bg-[#141417]/95 border border-[#E5E5E5] dark:border-[#27272a] flex flex-col max-h-[640px] shadow-xs">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold flex items-center gap-2 text-[#171717] dark:text-[#f2efe9]">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>User Registry</span>
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUserIds(users.map(u => u.id))}
                      className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline transition-colors cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-slate-400 dark:text-neutral-600 text-[10px]">|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedUserIds([])}
                      className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 hover:text-[#171717] dark:hover:text-[#f2efe9] transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, github..."
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-[#E5E5E5] dark:border-[#27272a] text-[#171717] dark:text-[#f2efe9] placeholder:text-slate-400 dark:placeholder:text-neutral-500 rounded-xl text-xs outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                  />
                </div>
              </div>

              {/* User List Scrollable */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 dark:text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                    No users found
                  </div>
                ) : (
                  filteredUsers.map((u) => (
                    <div
                      key={u.id}
                      className={`p-3.5 rounded-xl border transition-all flex justify-between items-center ${selectedUserIds.includes(u.id)
                        ? "border-blue-300 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30"
                        : "border-[#E5E5E5] dark:border-[#27272a] bg-neutral-50/50 dark:bg-neutral-900/40 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60"
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
                          className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 shrink-0"
                        />
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <span className="text-xs font-bold text-[#171717] dark:text-[#f2efe9] block truncate">
                            {u.name || "Anonymous User"}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-neutral-400 block truncate">
                            {u.email}
                          </span>
                          {u.githubUsername && (
                            <span className="inline-block px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-[#E5E5E5] dark:border-[#27272a] text-[9px] text-slate-600 dark:text-neutral-300 font-bold uppercase tracking-wider">
                              github: {u.githubUsername}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <div className="text-[10px] text-slate-400 dark:text-neutral-500 font-bold uppercase tracking-wide flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(u.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
