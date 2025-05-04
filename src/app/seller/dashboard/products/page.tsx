'use client';

import { useState } from 'react';
import ProductCard from '@/components/shared/product/product-card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import {mockProducts} from "@/app/seller/dashboard/products/products";

export default function ProductsPage() {
    const [category, setCategory] = useState<string>('');
    const [search, setSearch] = useState('');

    const filteredProducts = mockProducts.filter((product) => {
        const matchesCategory = category ? product.category === category : true;
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Products</h1>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Input
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-xs"
                />

                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        <SelectItem value="Jeans">Jeans</SelectItem>
                        <SelectItem value="Shoes">Shoes</SelectItem>
                        <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                        <SelectItem value="Wrist Watches">Wrist Watches</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            /* eslint-disable @typescript-eslint/no-explicit-any */
                            product={product as any} // Type assertion to bypass type checking
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">No products found matching your criteria.</p>
                    <button
                        className="mt-4 text-blue-600 hover:underline"
                        onClick={() => {
                            setSearch('');
                            setCategory('');
                        }}
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}