import {
  LayoutDashboard, Mic, Settings, LogOut, Stethoscope,
  Menu, X, MessageCircle, Users, ChevronLeft, ChevronRight,
  User, Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { User as AppUser, Page } from '@/App';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardLayoutProps {
  user: AppUser;
  currentPage: string;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function DashboardLayout({ user, currentPage, onNavigate, onLogout, children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recording', label: 'New Recording', icon: Mic },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'image-analysis', label: 'Image Analysis', icon: Stethoscope },
    { id: 'chat', label: 'AI Assistant', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out z-30 sticky top-0 h-screen shadow-sm",
          isSidebarOpen ? "w-[260px]" : "w-[80px]"
        )}
      >
        {/* Sidebar Header */}
        <div className={cn(
          "h-16 flex items-center px-4 border-b border-border transition-all",
          isSidebarOpen ? "justify-between" : "justify-center"
        )}>
          {isSidebarOpen ? (
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
              <div className="bg-primary/10 p-1.5 rounded-lg">
                <Stethoscope className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-lg text-primary tracking-tight">ClinicalScribe</span>
            </div>
          ) : (
            <div className="bg-primary/10 p-2 rounded-lg">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className={cn("h-6 w-6 text-muted-foreground", !isSidebarOpen && "hidden")}
            onClick={() => setIsSidebarOpen(false)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto py-6">
          <TooltipProvider delayDuration={0}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              if (!isSidebarOpen) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onNavigate(item.id as Page)}
                        className={cn(
                          "w-full h-12 flex items-center justify-center rounded-xl transition-all duration-200 group relative",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <Icon className={cn("w-5 h-5 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-r-full" />}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium bg-foreground text-background border-none ml-2">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as Page)}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform", isActive ? "" : "group-hover:scale-110")} />
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                  )}
                </button>
              );
            })}
          </TooltipProvider>
        </nav>

        {/* Sidebar Footer (User Profile) */}
        <div className="p-4 border-t border-border mt-auto">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-xl border border-border/50">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.specialty}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-70 hover:opacity-100" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-9 w-9 border border-border cursor-pointer hover:ring-2 ring-primary transition-all">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Toggle Button (when collapsed) */}
        {!isSidebarOpen && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute -right-3 top-20 bg-background border border-border rounded-full h-6 w-6 p-0 shadow-sm z-50 hover:bg-accent"
            onClick={() => setIsSidebarOpen(true)}
          >
            <ChevronRight className="w-3 h-3" />
          </Button>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-border bg-card flex items-center justify-between px-4 z-40 relative">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <span className="font-bold text-lg text-primary">ClinicalScribe</span>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm lg:hidden animate-in slide-in-from-left duration-200">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-xl ml-2">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id as Page);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-4 w-full px-4 py-4 rounded-xl transition-colors text-lg",
                        isActive ? "bg-primary text-primary-foreground font-medium" : "bg-muted/30 hover:bg-muted"
                      )}
                    >
                      <Icon className="w-6 h-6" />
                      {item.label}
                    </button>
                  )
                })}
              </nav>
              <div className="absolute bottom-8 left-4 right-4">
                <Button variant="outline" className="w-full gap-2 py-6 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={onLogout}>
                  <LogOut className="w-5 h-5" />
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Header / Topbar */}
        <div className="hidden lg:flex h-16 border-b border-border bg-card/50 backdrop-blur items-center justify-between px-8 sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-semibold capitalize tracking-tight flex items-center gap-2">
              {currentPage.replace('-', ' ')}
              {currentPage === 'image-analysis' && <span className="text-xs bg-cyan-500/10 text-cyan-600 px-2 py-0.5 rounded-full font-mono font-normal">v2.0 Beta</span>}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
            </Button>
            <div className="h-8 w-px bg-border/60 mx-1" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium leading-none">Dr. {user.name.split(' ').pop()}</p>
                <p className="text-xs text-muted-foreground mt-1">Available</p>
              </div>
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-auto bg-muted/10 p-4 lg:p-8 relative">
          <div className="max-w-[1600px] mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
