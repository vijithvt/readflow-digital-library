
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import ThemeSwitcher from "./ThemeSwitcher";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 border-b bg-background px-6 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-deepBlue-700 dark:text-deepBlue-200">
            Thinkpalm Reading Hub
          </h1>
          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
          </div>
        </header>
        <main className="p-6">{children}</main>
        <footer className="border-t p-6 text-center text-sm text-gray-500">
          © Vijith V T. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
}
