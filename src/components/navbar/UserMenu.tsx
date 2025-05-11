
import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserType } from '@/types/user';

interface UserMenuProps {
  user: UserType | null;
  isAdmin: boolean;
  signOut: () => void;
  getInitial: () => string;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, isAdmin, signOut, getInitial }) => {
  if (!user) {
    return (
      <Link to="/auth">
        <Button 
          variant="outline" 
          size="sm"
          aria-label="Sign In"
        >
          <LogIn className="h-4 w-4 mr-2" aria-hidden="true" />
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-8 w-8 rounded-full"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitial()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem disabled>
          <User className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>{user.email}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link to="/upload">
          <DropdownMenuItem>
            Upload Dataset
          </DropdownMenuItem>
        </Link>
        {isAdmin && <>
            <DropdownMenuSeparator />
            <Link to="/admin/verification">
              <DropdownMenuItem>
                Dataset Verification
              </DropdownMenuItem>
            </Link>
          </>}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
