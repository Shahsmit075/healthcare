'use client';

import { useEffect, useState } from 'react';
import { Layout, Button, Space } from 'antd';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserOutlined } from '@ant-design/icons';
import Image from 'next/image';

const { Header } = Layout;

export default function AppHeader() {
  const { user } = useUser();
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      if (user?.sub) {
        try {
          const response = await fetch(`/api/user/profile`);
          if (response.ok) {
            const data = await response.json();
            setUserId(data.id);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserId();
  }, [user]);

  const isActive = (path: string) => pathname === path;

  return (
    <Header className="flex justify-between items-center bg-white border-b border-gray-200 px-6">
      <div className="flex items-center">
        <Image src="/logo1.png" alt="logo" width={50} height={50} />
        <Link href="/" className="text-xl font-bold text-blue-600 mr-8">
          Lief Healthcare Clock-In
        </Link>
        {user && (
          <Space size="middle" className="hidden sm:flex">
            <Link 
              href="/dashboard" 
              className={`hover:text-blue-600 ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-600'}`}
            >
              Dashboard
            </Link>
            <Link 
              href="/clock-in" 
              className={`hover:text-blue-600 ${isActive('/clock') ? 'text-blue-600' : 'text-gray-600'}`}
            >
              Clock In/Out
            </Link>
            <Link 
              href="/history" 
              className={`hover:text-blue-600 ${isActive('/history') ? 'text-blue-600' : 'text-gray-600'}`}
            >
              History
            </Link>
          </Space>
        )}
      </div>
      <div>
        {user ? (
          <Space>
            {userId && (
              <Link 
                href={`/staff/${userId}`} 
                className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <UserOutlined />
                {user.name}
              </Link>
            )}
            <Link href="/api/auth/logout">
              <Button type="default">Logout</Button>
            </Link>
          </Space>
        ) : (
          <Link href="/api/auth/login">
            <Button type="primary">Login</Button>
          </Link>
        )}
      </div>
    </Header>
  );
} 