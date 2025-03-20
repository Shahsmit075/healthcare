'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { Card, Table, DatePicker, Space, Typography, Statistic, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ClockInRecord } from '@/types/clock-in';
import { StaffMember } from '@/types/staff';
import { useUser } from '@auth0/nextjs-auth0/client';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title } = Typography;

interface StaffDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function StaffDetailPage({ params }: StaffDetailPageProps) {
  const resolvedParams = use(params);
  const { user } = useUser();
  const [staffDetails, setStaffDetails] = useState<StaffMember | null>(null);
  const [clockInRecords, setClockInRecords] = useState<ClockInRecord[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs()
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch staff details
        const response = await fetch(`/api/staff/${resolvedParams.id}`);
        if (!response.ok) throw new Error('Failed to fetch staff details');
        const data = await response.json();
        setStaffDetails(data);

        // Fetch clock-in records with date range
        const recordsResponse = await fetch(
          `/api/clock-in/staff/${resolvedParams.id}?startDate=${dateRange[0].toISOString()}&endDate=${dateRange[1].toISOString()}`
        );
        if (!recordsResponse.ok) throw new Error('Failed to fetch clock-in records');
        const recordsData = await recordsResponse.json();
        setClockInRecords(recordsData);
      } catch (error) {
        console.error('Error fetching staff details:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffDetails();
  }, [resolvedParams.id, dateRange]);

  const columns: ColumnsType<ClockInRecord> = [
    {
      title: 'Clock In',
      dataIndex: 'clockInTime',
      key: 'clockInTime',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Clock Out',
      dataIndex: 'clockOutTime',
      key: 'clockOutTime',
      render: (text) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!staffDetails) return <div>Staff member not found</div>;

  return (
    <div className="p-6">
      <Card className="mb-6">
        <Title level={2}>Staff Details</Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Statistic title="Name" value={staffDetails.name} />
          </Col>
          <Col span={8}>
            <Statistic title="Email" value={staffDetails.email} />
          </Col>
          <Col span={8}>
            <Statistic title="Role" value={staffDetails.role} />
          </Col>
        </Row>
      </Card>

      <Card className="mb-6">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={3}>Clock-in History</Title>
          <RangePicker
            value={dateRange}
            onChange={(dates) => {
              if (dates) {
                setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs]);
              }
            }}
          />
          <Table
            columns={columns}
            dataSource={clockInRecords}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Space>
      </Card>
    </div>
  );
} 