'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BellIcon, Search, X } from "lucide-react";
import { LanguageSelector } from './language-selector';
import { UserProfile } from './user-profile';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { dataService, type SearchResult } from '@/lib/data-service';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = dataService.search(query);
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.link);
    clearSearch();
  };

  const showMenuItem = (permission: string) => {
    return user?.permissions?.[permission] || user?.role === 'Administrator';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-red-500">
            Get Home Realty
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          {showMenuItem('dashboard') && (
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:text-gray-900",
                pathname === '/dashboard' ? "bg-gray-100 text-gray-900" : ""
              )}
            >
              <span className="grid h-6 w-6 place-items-center">📊</span>
              Dashboard
            </Link>
          )}
          {showMenuItem('leads') && (
            <Link
              href="/lead"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:text-gray-900",
                pathname === '/lead' ? "bg-gray-100 text-gray-900" : ""
              )}
            >
              <span className="grid h-6 w-6 place-items-center">👥</span>
              Lead
            </Link>
          )}
          {showMenuItem('favorites') && (
            <Link
              href="/favorites"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:text-gray-900",
                pathname === '/favorites' ? "bg-gray-100 text-gray-900" : ""
              )}
            >
              <span className="grid h-6 w-6 place-items-center">❤️</span>
              Favorites
            </Link>
          )}
          {showMenuItem('email') && (
            <Link
              href="/inbox"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:text-gray-900",
                pathname === '/inbox' ? "bg-gray-100 text-gray-900" : ""
              )}
            >
              <span className="grid h-6 w-6 place-items-center">📬</span>
              Inbox
            </Link>
          )}
          {showMenuItem('inventory') && (
            <Link
              href="/inventory"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:text-gray-900",
                pathname === '/inventory' ? "bg-gray-100 text-gray-900" : ""
              )}
            >
              <span className="grid h-6 w-6 place-items-center">🏠</span>
              Inventory
            </Link>
          )}
          {showMenuItem('users') && (
            <Link
              href="/users"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:text-gray-900",
                pathname === '/users' ? "bg-gray-100 text-gray-900" : ""
              )}
            >
              <span className="grid h-6 w-6 place-items-center"></span>
              Users
            </Link>
          )}
          {showMenuItem('calendar') && (
            <Link
              href="/calendar"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:text-gray-900",
                pathname === '/calendar' ? "bg-gray-100 text-gray-900" : ""
              )}
            >
              <span className="grid h-6 w-6 place-items-center">📅</span>
              Calendar
            </Link>
          )}
          {showMenuItem('settings') && (
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:text-gray-900",
                pathname === '/settings' ? "bg-gray-100 text-gray-900" : ""
              )}
            >
              <span className="grid h-6 w-6 place-items-center">⚙️</span>
              Settings
            </Link>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search events, properties..."
                className="w-[300px] pl-8"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {/* Search Results Dropdown */}
              {isSearching && searchResults.length > 0 && (
                <Card className="absolute top-full left-0 w-[400px] mt-2 shadow-lg">
                  <CardContent className="p-2">
                    {searchResults.map((result) => (
                      <Button
                        key={`${result.type}-${result.id}`}
                        variant="ghost"
                        className="w-full justify-start text-left px-2 py-1.5"
                        onClick={() => handleResultClick(result)}
                      >
                        <div>
                          <div className="font-medium">{result.title}</div>
                          <div className="text-sm text-gray-500">{result.subtitle}</div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}
              {isSearching && searchResults.length === 0 && searchQuery && (
                <Card className="absolute top-full left-0 w-[400px] mt-2 shadow-lg">
                  <CardContent className="p-4 text-center text-gray-500">
                    No results found
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <BellIcon className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <LanguageSelector />
            <UserProfile username="Admin User" role="Administrator" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

