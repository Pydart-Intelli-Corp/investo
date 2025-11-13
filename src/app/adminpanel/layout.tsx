import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - Investogold",
  description: "Admin dashboard for Investogold platform management",
  icons: {
    icon: [
      { url: '/images/logo.webp', sizes: 'any' },
      { url: '/images/logo.webp', sizes: '16x16', type: 'image/webp' },
      { url: '/images/logo.webp', sizes: '32x32', type: 'image/webp' },
    ],
    shortcut: '/images/logo.webp',
    apple: '/images/logo.webp',
  },
};

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-panel">
      {children}
    </div>
  );
}