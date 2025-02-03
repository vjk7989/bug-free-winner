'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useRouter } from 'next/navigation';

interface UserProfileProps {
  username: string;
  role: string;
}

export function UserProfile({ username, role }: UserProfileProps) {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    // Generate a random profile image using DiceBear API
    const seed = Math.random().toString(36).substring(7);
    setProfileImage(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          {profileImage && (
            <Image
              src={profileImage}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <div className="text-left">
            <p className="text-sm font-medium">{username}</p>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 