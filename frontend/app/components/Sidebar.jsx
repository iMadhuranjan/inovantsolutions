'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
    const pathname = usePathname();

    const links = [
        { name: 'All Products', href: '/' },
        { name: 'Add Product', href: '/add' },
    ];

    return (
        <aside className="h-screen w-full bg-gray-100 border-r border-gray-300 p-4">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            <nav className="flex flex-col gap-2">
                {links.map((link) => {
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-200'}
              `}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
