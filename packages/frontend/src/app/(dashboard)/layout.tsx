"use client";

import { AuthProvider } from "@/providers/auth-provider";
import { SyncProvider } from "@/providers/sync-provider";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { OfflineBanner } from "@/components/shared/offline-banner";
import { InstallPrompt } from "@/components/shared/install-prompt";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SyncProvider>
        <div className="flex h-screen overflow-hidden">
          <AppSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <AppHeader />
            <OfflineBanner />
            <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
              <div className="container mx-auto p-4 md:p-6">{children}</div>
            </main>
            <MobileNav />
          </div>
        </div>
        <InstallPrompt />
      </SyncProvider>
    </AuthProvider>
  );
}
