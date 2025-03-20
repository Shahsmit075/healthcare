'use client';

import { Layout } from 'antd';
import Header from '@/components/Header';

const { Content } = Layout;

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout className="min-h-screen bg-transparent">
      <Header />
      <Content className="p-6">
        {children}
      </Content>
    </Layout>
  );
} 