// /seller/dashboard/seller-nav.tsx
'use client';

import Link from 'next/link';

export default function SellerNav() {
    return (
        <nav className="w-64 bg-gray-100 p-4">
            <ul className="space-y-4">
                <li>
                    <Link href="/seller/dashboard">Overview</Link>
                </li>
                <li>
                    <Link href="/seller/dashboard/products">Products</Link>
                </li>
                <li>
                    <Link href="/seller/dashboard/products/new">Add Product</Link>
                </li>
            </ul>
        </nav>
    );
}
