"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell, Settings, User, X, Check, Shield, Cpu, RefreshCw, Moon, Brain, Sun, LogOut, HelpCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";

interface DashboardControlsProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: "success" | "info" | "warning";
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [];

export function DashboardControls({ user }: DashboardControlsProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [aiModel, setAiModel] = useState("gemini");
  const [autoSync, setAutoSync] = useState(true);
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  const initials = (user.name || "User")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "AM";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("sclade-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("sclade-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("sclade-theme", "light");
    }
  }, [theme]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);

  useEffect(() => {
    const loadNotifications = () => {
      const saved = localStorage.getItem("sclade-notifications");
      if (saved) {
        try {
          setNotifications(JSON.parse(saved));
        } catch (e) {
          // Keep DEFAULT_NOTIFICATIONS
        }
      } else {
        localStorage.setItem("sclade-notifications", JSON.stringify(DEFAULT_NOTIFICATIONS));
      }
    };

    loadNotifications();

    window.addEventListener("sclade-notifications-updated", loadNotifications);
    return () => {
      window.removeEventListener("sclade-notifications-updated", loadNotifications);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("sclade-notifications", JSON.stringify(updated));
    window.dispatchEvent(new Event("sclade-notifications-updated"));
  };

  const clearNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("sclade-notifications", JSON.stringify(updated));
    window.dispatchEvent(new Event("sclade-notifications-updated"));
  };

  return (
    <div className="relative flex items-center gap-3">
      {/* ── Theme Switcher ── */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-lg border border-[var(--sclade-card-border)] bg-[var(--sclade-card-bg)] hover:bg-[#E7EDFF] hover:border-[#CFD9FF] hover:text-[#5473D1] transition-all text-[var(--sclade-text-secondary)] cursor-pointer relative"
        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* ── Notification Trigger ── */}
      <div className="relative">
        <button
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowSettings(false);
          }}
          className={`p-2 rounded-lg border border-[var(--sclade-card-border)] bg-[var(--sclade-card-bg)] hover:bg-[#E7EDFF] hover:border-[#CFD9FF] hover:text-[#5473D1] transition-all text-[var(--sclade-text-secondary)] cursor-pointer relative ${
            showNotifications ? "bg-[#E7EDFF] text-[#5473D1] border-[#CFD9FF]" : ""
          }`}
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#5473D1] rounded-full flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-white dark:ring-neutral-900 animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        <AnimatePresence>
          {showNotifications && (
            <>
              {/* Invisible backdrop to close on click outside */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] shadow-lg z-50 p-5 overflow-hidden text-[var(--sclade-text-primary)]"
              >
                <div className="flex items-center justify-between border-b border-[var(--sclade-card-border)] pb-3 mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--sclade-text-secondary)]">
                    System Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[10px] font-bold text-[#5473D1] hover:text-[#4261C0] transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-[var(--sclade-text-muted)] text-[11px] font-medium uppercase tracking-wider">
                      All caught up!
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-lg border transition-all relative group/item ${
                          n.read
                            ? "bg-[#F0F3F8] dark:bg-neutral-900/40 border-[var(--sclade-card-border)]"
                            : "bg-[#E7EDFF]/50 border-[#CFD9FF] shadow-xs"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {!n.read && (
                                <span className="w-1.5 h-1.5 bg-[#5473D1] rounded-full shrink-0" />
                              )}
                              <span className="text-xs font-bold text-[var(--sclade-text-primary)]">
                                {n.title}
                              </span>
                            </div>
                            <p className="text-xs text-[var(--sclade-text-secondary)] mt-1 leading-relaxed">
                              {n.desc}
                            </p>
                            <span className="text-[10px] font-medium text-[var(--sclade-text-muted)] block mt-2 uppercase tracking-wide">
                              {n.time}
                            </span>
                          </div>
                          <button
                            onClick={() => clearNotification(n.id)}
                            className="text-[var(--sclade-text-muted)] hover:text-red-500 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-all cursor-pointer opacity-0 group-hover/item:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>



      {/* Settings Side-Drawer */}
      {mounted && createPortal(
        <AnimatePresence>
          {showSettings && (
            <>
              {/* Backdrop Blur Overlay */}
              <motion.div
                key="settings-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] cursor-pointer"
                onClick={() => setShowSettings(false)}
              />

              {/* Slide-over Panel */}
              <motion.div
                key="settings-panel"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--sclade-popover-bg)] border-l border-[var(--sclade-popover-border)] shadow-xl z-[10000] p-6 md:p-8 flex flex-col justify-between text-[var(--sclade-text-primary)]"
              >
                <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--sclade-card-border)] pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#E7EDFF] border border-[#CFD9FF] flex items-center justify-center text-[#5473D1]">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--sclade-text-primary)]">
                        Workspace Settings
                      </h3>
                      <p className="text-[11px] text-[var(--sclade-text-secondary)] mt-0.5">
                        Configure Resummit Parameters
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-1.5 bg-[var(--sclade-btn-secondary-bg)] border border-[var(--sclade-card-border)] hover:bg-[#E7EDFF] hover:border-[#CFD9FF] hover:text-[#5473D1] text-[var(--sclade-text-secondary)] rounded-lg transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form fields */}
                <div className="space-y-5">
                  {/* AI Model Calibrator */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--sclade-text-secondary)] block">
                      AI Generation Model
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--sclade-btn-secondary-bg)] border border-[var(--sclade-card-border)] rounded-xl">
                      <button
                        onClick={() => setAiModel("gemini")}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          aiModel === "gemini"
                            ? "bg-[#5473D1] text-white shadow-xs"
                            : "text-[var(--sclade-text-secondary)] hover:text-[var(--sclade-text-primary)] hover:bg-white dark:hover:bg-neutral-800"
                        }`}
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        Gemini Flash
                      </button>
                      <button
                        onClick={() => setAiModel("claude")}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          aiModel === "claude"
                            ? "bg-[#5473D1] text-white shadow-xs"
                            : "text-[var(--sclade-text-secondary)] hover:text-[var(--sclade-text-primary)] hover:bg-white dark:hover:bg-neutral-800"
                        }`}
                      >
                        <Brain className="w-3.5 h-3.5" />
                        Claude 3.5
                      </button>
                    </div>
                  </div>

                  {/* Sync Automation */}
                  <div className="p-4 rounded-xl bg-[var(--sclade-btn-secondary-bg)] border border-[var(--sclade-card-border)] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[var(--sclade-text-primary)] block">
                        Auto-Update Resume
                      </span>
                      <span className="text-[11px] text-[var(--sclade-text-secondary)] mt-0.5 block">
                        Trigger updates on GitHub pushes
                      </span>
                    </div>
                    <button
                      onClick={() => setAutoSync(!autoSync)}
                      className={`w-11 h-6 rounded-full transition-all relative p-0.5 cursor-pointer ${
                        autoSync ? "bg-[#5473D1]" : "bg-[#E1E5EB] dark:bg-neutral-800"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 bg-white rounded-full block transition-all shadow-xs ${
                          autoSync ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Account Security */}
                  <div className="p-4 rounded-xl bg-[var(--sclade-btn-secondary-bg)] border border-[var(--sclade-card-border)] space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--sclade-text-primary)]">
                      <Shield className="w-4 h-4 text-[#32704F]" />
                      <span>Security & Integrations</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-[var(--sclade-text-secondary)]">
                      <div className="flex justify-between">
                        <span>Database Mode:</span>
                        <span className="font-semibold text-[var(--sclade-text-primary)]">Postgres Integration</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API Status:</span>
                        <span className="text-[#32704F] font-semibold">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col gap-2 pt-6 border-t border-[var(--sclade-card-border)]">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full py-2.5 bg-[#5473D1] hover:bg-[#4261C0] active:scale-[0.99] text-white transition-all font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  Save Parameters
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full py-2 bg-transparent hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 border border-red-200 dark:border-red-900/40 active:scale-[0.99] transition-all font-semibold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    )}

      {/* ── Settings Gear Button ── */}
      <button
        onClick={() => {
          setShowSettings(!showSettings);
          setShowNotifications(false);
          setShowUserMenu(false);
        }}
        className={`p-2 rounded-lg border border-[var(--sclade-card-border)] bg-[var(--sclade-card-bg)] hover:bg-[#E7EDFF] hover:border-[#CFD9FF] hover:text-[#5473D1] transition-all text-[var(--sclade-text-secondary)] cursor-pointer ${
          showSettings ? "bg-[#E7EDFF] text-[#5473D1] border-[#CFD9FF]" : ""
        }`}
        title="Settings"
      >
        <Settings className="w-4 h-4" />
      </button>

      {/* ── User Avatar & Dropdown Menu ── */}
      <div className="relative">
        <button
          onClick={() => {
            setShowUserMenu(!showUserMenu);
            setShowNotifications(false);
            setShowSettings(false);
          }}
          className="flex items-center justify-center cursor-pointer focus:outline-none hover:opacity-90 transition-opacity"
          aria-label="User profile menu"
        >
          {user.image ? (
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[var(--sclade-card-border)] shadow-xs">
              <img
                src={user.image}
                alt={user.name || "User profile"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#E1E5EB] dark:bg-neutral-800 border border-[var(--sclade-card-border)] flex items-center justify-center text-xs font-bold text-[var(--sclade-text-secondary)] shadow-xs">
              {initials}
            </div>
          )}
        </button>

        <AnimatePresence>
          {showUserMenu && (
            <>
              {/* Invisible backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] shadow-xl z-50 p-2 overflow-hidden text-[var(--sclade-text-primary)]"
              >
                {/* User Info Header */}
                <div className="flex items-center gap-3 p-3">
                  <div className="w-9 h-9 rounded-full bg-[#E1E5EB] dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-[var(--sclade-text-secondary)] shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[var(--sclade-text-primary)] truncate">
                      {user.name || "Adel Muhammed"}
                    </p>
                    <p className="text-[11px] text-[var(--sclade-text-secondary)] truncate">
                      {user.email || ""}
                    </p>
                  </div>
                </div>

                <div className="h-[1px] bg-[var(--sclade-card-border)] my-1" />

                {/* Dropdown Items */}
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowSettings(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--sclade-text-secondary)] hover:text-[var(--sclade-text-primary)] hover:bg-[var(--sclade-subtle-bg)] rounded-lg transition-colors cursor-pointer text-left"
                  >
                    <Settings className="w-4 h-4 text-[var(--sclade-text-muted)]" />
                    Settings
                  </button>
                  <a
                    href="mailto:support@resummit.dev?subject=Resummit%20Help"
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--sclade-text-secondary)] hover:text-[var(--sclade-text-primary)] hover:bg-[var(--sclade-subtle-bg)] rounded-lg transition-colors cursor-pointer text-left"
                  >
                    <HelpCircle className="w-4 h-4 text-[var(--sclade-text-muted)]" />
                    Help & Support
                  </a>
                </div>

                <div className="h-[1px] bg-[var(--sclade-card-border)] my-1" />

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Sign Out
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
