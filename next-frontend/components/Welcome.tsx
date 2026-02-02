import React from 'react';

interface WelcomeProps {
  onJoin: () => void;
}

export default function Welcome({ onJoin }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <div className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <span className="material-symbols-outlined text-2xl">chat_bubble</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-extrabold leading-tight tracking-tight flex-1 text-center font-display">
            RandomChat
          </h2>
          <div className="flex w-10 items-center justify-end">
            <button className="text-primary text-sm font-bold tracking-wide">Sign In</button>
          </div>
        </div>
      </header>
      <main className="max-w-md mx-auto pb-20">
        {/* Hero Section */}
        <section className="relative px-4 pt-4 pb-8 @container">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(43,141,238,0.15)_0%,rgba(16,25,34,0)_70%)]"></div>
          <div className="flex min-h-[420px] flex-col gap-8 rounded-xl items-center justify-center p-6 text-center overflow-hidden relative border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
            {/* Visual Background Element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="flex flex-col gap-4 relative z-10">
              <div className="inline-flex items-center self-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                Secure & Anonymous
              </div>
              <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.03em] @[480px]:text-5xl">
                Connect with the World, <span className="text-primary">Instantly.</span>
              </h1>
              <p className="text-slate-600 dark:text-[#92adc9] text-base font-medium leading-relaxed max-w-[280px] mx-auto">
                Meet new people safely and anonymously with one tap.
              </p>
            </div>
            <div className="w-full flex flex-col gap-3 relative z-10">
              <button
                onClick={onJoin}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-8 bg-primary text-white text-lg font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform"
              >
                <span className="truncate">Start Chatting</span>
                <span className="material-symbols-outlined ml-2">bolt</span>
              </button>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">No registration required</p>
            </div>
          </div>
        </section>
        {/* Feature Section Header */}
        <div className="px-6 py-4">
          <h4 className="text-slate-500 dark:text-[#92adc9] text-xs font-black leading-normal tracking-[0.15em] uppercase text-center">Why Choose RandomChat</h4>
        </div>
        {/* Features Grid */}
        <section className="grid grid-cols-1 gap-4 p-4">
          <div className="flex flex-1 gap-4 rounded-xl border border-slate-200 dark:border-[#324d67] bg-white dark:bg-[#192633] p-5 flex-col shadow-sm">
            <div className="text-primary bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">shield_person</span>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Anonymity</h2>
              <p className="text-slate-600 dark:text-[#92adc9] text-sm font-medium leading-relaxed">Your identity stays private until you choose to share. We don't track your data.</p>
            </div>
          </div>
          <div className="flex flex-1 gap-4 rounded-xl border border-slate-200 dark:border-[#324d67] bg-white dark:bg-[#192633] p-5 flex-col shadow-sm">
            <div className="text-primary bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">public</span>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Global Reach</h2>
              <p className="text-slate-600 dark:text-[#92adc9] text-sm font-medium leading-relaxed">Chat with users from over 150 countries. Break barriers instantly.</p>
            </div>
          </div>
          <div className="flex flex-1 gap-4 rounded-xl border border-slate-200 dark:border-[#324d67] bg-white dark:bg-[#192633] p-5 flex-col shadow-sm">
            <div className="text-primary bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">offline_bolt</span>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Instant Connection</h2>
              <p className="text-slate-600 dark:text-[#92adc9] text-sm font-medium leading-relaxed">No waiting. No profiles to swipe. Just one tap and you're talking.</p>
            </div>
          </div>
        </section>
        {/* Safety Action Panel */}
        <section className="p-4 @container">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-primary/20 bg-primary/5 p-6 border-dashed">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">encrypted</span>
                <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Safe & Secure</p>
              </div>
              <p className="text-slate-600 dark:text-[#92adc9] text-base font-medium leading-relaxed">
                End-to-end encrypted conversations for your peace of mind. We prioritize your safety above all else.
              </p>
            </div>
            <a className="text-sm font-bold leading-normal tracking-wide flex items-center gap-2 text-primary group" href="#">
              Learn more about safety
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
          </div>
        </section>
        {/* User Stats Section */}
        <section className="px-4 py-8">
          <div className="flex justify-around items-center p-6 bg-slate-100 dark:bg-[#192633] rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-black text-primary">10M+</p>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Users</p>
            </div>
            <div className="w-px h-8 bg-slate-300 dark:bg-slate-700"></div>
            <div className="text-center">
              <p className="text-2xl font-black text-primary">24/7</p>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Moderation</p>
            </div>
            <div className="w-px h-8 bg-slate-300 dark:bg-slate-700"></div>
            <div className="text-center">
              <p className="text-2xl font-black text-primary">150+</p>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Countries</p>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="p-8 text-center flex flex-col gap-4">
          <div className="flex justify-center gap-6 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
          <p className="text-slate-400 dark:text-slate-600 text-[10px]">© 2024 RandomChat App. All rights reserved.</p>
        </footer>
      </main>
      {/* Bottom Indicator for Mobile */}
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full opacity-50"></div>
    </div>
  );
}
