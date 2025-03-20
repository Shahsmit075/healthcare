'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { Card, Typography, Space, Table, Spin, Alert, Button } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ClockIn {
  id: string;
  clockInTime: string;
  clockOutTime: string | null;
}

export default function History() {
  const { user, isLoading: isUserLoading } = useUser();
  const [clockIns, setClockIns] = useState<ClockIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchClockInHistory();
    }
  }, [user]);

  const fetchClockInHistory = async () => {
    try {
      const response = await fetch('/api/clock-in/history');
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setClockIns(data);
    } catch (err) {
      setError('Failed to fetch clock-in history');
      console.error('History fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: 'Clock In',
      dataIndex: 'clockInTime',
      key: 'clockInTime',
      render: (text: string) => new Date(text).toLocaleString(),
      sorter: (a: ClockIn, b: ClockIn) => 
        new Date(a.clockInTime).getTime() - new Date(b.clockInTime).getTime()
    },
    {
      title: 'Clock Out',
      dataIndex: 'clockOutTime',
      key: 'clockOutTime',
      render: (text: string | null) => text ? new Date(text).toLocaleString() : 'Active',
      sorter: (a: ClockIn, b: ClockIn) => {
        if (!a.clockOutTime) return 1;
        if (!b.clockOutTime) return -1;
        return new Date(a.clockOutTime).getTime() - new Date(b.clockOutTime).getTime();
      }
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (record: ClockIn) => {
        if (!record.clockOutTime) return 'Ongoing';
        const duration = new Date(record.clockOutTime).getTime() - new Date(record.clockInTime).getTime();
        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
      }
    }
  ];

  if (isUserLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <Space direction="vertical" size="large" className="w-full">
            <Title level={3}>Please Log In</Title>
            <Text>You need to be logged in to view your history.</Text>
            <Button type="primary" href="/api/auth/login">
              Log In
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <Space direction="vertical" size="large" className="w-full">
          <div className="flex justify-between items-center">
            <div>
              <Title level={2}>Clock-In History</Title>
              <Text type="secondary">View your past clock-in records</Text>
            </div>
            <Space>
              <Button 
                type="primary" 
                icon={<ClockCircleOutlined />}
                onClick={fetchClockInHistory}
              >
                Refresh
              </Button>
            </Space>
          </div>

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
            />
          )}

          <Table
            columns={columns}
            dataSource={clockIns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} records`
            }}
          />
        </Space>
      </Card>
    </div>
  );
} 