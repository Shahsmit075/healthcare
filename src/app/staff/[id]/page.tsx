'use client';

import { useEffect, useState } from 'react';
import { Card, Descriptions, Table, Statistic, Row, Col, DatePicker } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

interface ClockInRecord {
  id: string;
  clockInTime: string;
  clockOutTime: string | null;
  notes?: string;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  totalHours: number;
  averageHoursPerDay: number;
  clockInHistory: ClockInRecord[];
}

export default function StaffDetailPage({ params }: { params: { id: string } }) {
  const [staffMember, setStaffMember] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs()
  ]);

  const { RangePicker } = DatePicker;

  useEffect(() => {
    const fetchStaffDetails = async () => {
      if (!params.id) return;
      try {
        const response = await fetch(`/api/staff/${params.id}?start=${dateRange[0].format('YYYY-MM-DD')}&end=${dateRange[1].format('YYYY-MM-DD')}`);
        if (!response.ok) throw new Error('Failed to fetch staff details');
        const data = await response.json();
        setStaffMember(data);
      } catch (error) {
        console.error('Error fetching staff details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffDetails();
  }, [params.id, dateRange]);

  const columns: ColumnsType<ClockInRecord> = [
    {
      title: 'Date',
      dataIndex: 'clockInTime',
      key: 'date',
      render: (text: string) => dayjs(text).format('MMMM D, YYYY'),
      filteredValue: null,
    },
    {
      title: 'Clock In',
      dataIndex: 'clockInTime',
      key: 'clockIn',
      render: (text: string) => dayjs(text).format('HH:mm:ss'),
      filteredValue: null,
    },
    {
      title: 'Clock Out',
      dataIndex: 'clockOutTime',
      key: 'clockOut',
      render: (text: string | null) => text ? dayjs(text).format('HH:mm:ss') : 'Active',
      filteredValue: null,
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_, record) => {
        if (!record.clockOutTime) return 'In Progress';
        const duration = dayjs(record.clockOutTime).diff(dayjs(record.clockInTime), 'hour', true);
        return `${duration.toFixed(2)} hours`;
      },
      filteredValue: null,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (text: string) => text || '-',
      filteredValue: null,
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (!staffMember) return <div>Staff member not found</div>;

  return (
    <div className="p-6">
      <Card className="mb-6">
        <Descriptions title="Staff Details" bordered>
          <Descriptions.Item label="Name">{staffMember.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{staffMember.email}</Descriptions.Item>
          <Descriptions.Item label="Role">{staffMember.role}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Hours"
              value={staffMember.totalHours}
              precision={2}
              prefix={<ClockCircleOutlined />}
              suffix="hours"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Average Hours/Day"
              value={staffMember.averageHoursPerDay}
              precision={2}
              prefix={<CheckCircleOutlined />}
              suffix="hours"
            />
          </Card>
        </Col>
      </Row>

      <Card title="Clock-in History" extra={
        <RangePicker
          value={dateRange}
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              setDateRange([dates[0], dates[1]]);
            }
          }}
        />
      }>
        <Table
          columns={columns}
          dataSource={staffMember.clockInHistory}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
} 