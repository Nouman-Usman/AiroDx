import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User as AppUser } from '@/App';

interface TopBarProps {
  user: AppUser;
  currentPage: string;
}

export function TopBar({ user, currentPage }: TopBarProps) {
  return (
    <div className="hidden lg:flex h-16 border-b border-border bg-card/50 backdrop-blur-sm items-center justify-between px-8 sticky top-0 z-20">
      <div>
        <h1 className="text-xl font-semibold capitalize tracking-tight flex items-center gap-2">
          {currentPage.replace('-', ' ')}
          {currentPage === 'image-analysis' && (
            <span className="text-xs bg-cyan-500/10 text-cyan-600 px-2 py-0.5 rounded-full font-mono font-normal">
              v2.0 Beta
            </span>
          )}
        </h1>
      </div>

      <div className="flex items-center gap-4">
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
  );
}
