'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { Button, Card, Typography, Space, Alert, Spin } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ClockInStatus {
  isClockedIn: boolean;
  activeClockIn: {
    id: string;
    clockInTime: string;
  } | null;
}

export default function ClockIn() {
  const { user, isLoading: isUserLoading } = useUser();
  const [clockInStatus, setClockInStatus] = useState<ClockInStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkClockInStatus();
    }
  }, [user]);

  const checkClockInStatus = async () => {
    try {
      const response = await fetch('/api/clock-in/status');
      if (!response.ok) throw new Error('Failed to check status');
      const data = await response.json();
      setClockInStatus(data);
    } catch (err) {
      setError('Failed to check clock-in status');
      console.error('Status check error:', err);
    }
  };

  const handleClockAction = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/clock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: clockInStatus?.isClockedIn ? 'CLOCK_OUT' : 'CLOCK_IN'
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to clock in/out');
      }

      await checkClockInStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clock in/out');
      console.error('Clock action error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) {
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
            <Text>You need to be logged in to clock in/out.</Text>
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
      <Card className="max-w-2xl mx-auto">
        <Space direction="vertical" size="large" className="w-full">
          <div className="text-center">
            <Title level={2}>Clock In/Out</Title>
            <Text type="secondary">Welcome back, {user.name}</Text>
          </div>

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
            />
          )}

          <div className="text-center py-8">
            <Space direction="vertical" size="large">
              <div className="text-4xl">
                {clockInStatus?.isClockedIn ? (
                  <ClockCircleOutlined className="text-green-500" />
                ) : (
                  <CheckCircleOutlined className="text-blue-500" />
                )}
              </div>
              <Text className="text-lg">
                {clockInStatus?.isClockedIn
                  ? 'You are currently clocked in'
                  : 'You are currently clocked out'}
              </Text>
              {clockInStatus?.activeClockIn && (
                <Text type="secondary">
                  Clocked in at: {new Date(clockInStatus.activeClockIn.clockInTime).toLocaleTimeString()}
                </Text>
              )}
            </Space>
          </div>

          <Button
            type="primary"
            size="large"
            block
            onClick={handleClockAction}
            loading={isSubmitting}
            className="h-12 text-lg"
          >
            {clockInStatus?.isClockedIn ? 'Clock Out' : 'Clock In'}
          </Button>
        </Space>
      </Card>
    </div>
  );
} 