'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Card, Row, Col, Table, Statistic, Spin, Tag, Input, Space } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import WeeklyHoursChart from '@/components/WeeklyHoursChart';
import Link from 'next/link';

interface StaffRecord {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  clockInTime?: string;
  hoursToday: number;
  weeklyHours: number;
  lastClockOut?: string;
  totalShifts: number;
}

interface DashboardStats {
  activeStaffCount: number;
  totalStaffCount: number;
  totalHoursToday: number;
  staffRecords: StaffRecord[];
  dailyHours: {
    date: string;
    hours: number;
  }[];
}

export default function Dashboard() {
  const { user, isLoading: userLoading } = useUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const columns: ColumnsType<StaffRecord> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: StaffRecord) => (
        <Link href={`/staff/${record.id}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
          <UserOutlined /> {text}
        </Link>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => 
        record.name.toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'success' : 'default'}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Inactive', value: 'Inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Clock In Time',
      dataIndex: 'clockInTime',
      key: 'clockInTime',
      render: (text) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: 'Hours Today',
      dataIndex: 'hoursToday',
      key: 'hoursToday',
      render: (hours) => hours.toFixed(2),
      sorter: (a, b) => a.hoursToday - b.hoursToday,
    },
    {
      title: 'Weekly Hours',
      dataIndex: 'weeklyHours',
      key: 'weeklyHours',
      render: (hours) => hours.toFixed(2),
      sorter: (a, b) => a.weeklyHours - b.weeklyHours,
    },
    {
      title: 'Last Clock Out',
      dataIndex: 'lastClockOut',
      key: 'lastClockOut',
      render: (text) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: 'Total Shifts',
      dataIndex: 'totalShifts',
      key: 'totalShifts',
      sorter: (a, b) => a.totalShifts - b.totalShifts,
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchStats();
      // Refresh data every minute
      const interval = setInterval(fetchStats, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (userLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center">
            <h2 className="text-xl">Please log in to view the dashboard</h2>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
      
      {/* Summary Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Staff"
              value={stats?.activeStaffCount || 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Staff"
              value={stats?.totalStaffCount || 0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Hours Today"
              value={stats?.totalHoursToday || 0}
              precision={2}
              suffix="hours"
            />
          </Card>
        </Col>
      </Row>

      {/* Weekly Hours Chart */}
      <Card className="mb-6">
        {stats?.dailyHours && <WeeklyHoursChart data={stats.dailyHours} />}
      </Card>

      {/* Staff Table */}
      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search staff..."
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            allowClear
          />
        </div>
        <Table
          columns={columns}
          dataSource={stats?.staffRecords || []}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
} 