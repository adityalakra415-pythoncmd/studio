"use client";

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { useTranslation } from '@/hooks/use-translation';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-start sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Logo className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold">DragonAI</h1>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-8 sm:grid-cols-2 lg:grid-cols-3 sm:mt-0">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-foreground">About Us</p>

              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
                <p className="text-lg font-medium text-foreground">Contact Us</p>
                <ul className="mt-4 space-y-2 text-sm">
                    <li>
                        <span className="text-muted-foreground">support@dragonai.com</span>
                    </li>
                </ul>
            </div>
            
            <div className="items-center justify-center text-center sm:text-right lg:col-span-1 sm:col-span-2">
                <div className="flex justify-center sm:justify-end">
                    <Logo className="w-16 h-16 text-primary" />
                </div>
                <p className="mt-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    lots of love team dragon
                </p>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">
            &copy; 2024 DragonAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
