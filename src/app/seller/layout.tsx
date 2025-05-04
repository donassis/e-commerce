// /seller/dashboard/layout.tsx
import SellerNav from './seller-nav';
import { ReactNode } from 'react';

export default function SellerDashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <SellerNav />
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
