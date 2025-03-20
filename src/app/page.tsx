'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Card, Typography, Space, Button, Row, Col, Statistic, Divider } from 'antd';
import { 
  ClockCircleOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  BarChartOutlined,
  EnvironmentOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
const { Title, Text, Paragraph } = Typography;

export default function Home() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-700 to-green-300 text-white">
        <div className="container mx-auto px-4 py-16">
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <div className="flex items-center mb-6">
                <div className="w-20 h-10 rounded-lg flex items-center justify-center mr-2">
                  {/* <ClockCircleOutlined className="text-blue-600 text-2xl" />
                   */}
                   <Image src="/logo1.png" alt="logo" width={60} height={50} />
                </div>
                <Title level={1} className="text-4xl font-bold text-white">
                  Lief Healthcare Clock-In
                </Title>
              </div>
              
              <Title level={2} className="text-3xl font-bold text-white mb-6">
                Modern Attendance Tracking For Healthcare Professionals
              </Title>
              
              <Paragraph className="text-xl text-blue-100 mb-8">
                Streamline your staff management with precise location-based clock-in, 
                comprehensive analytics, and real-time monitoring designed specifically 
                for healthcare facilities.
              </Paragraph>
              
              {user ? (
                <Space size="large">
                  <Link href="/clock-in">
                    <Button type="primary" size="large" icon={<ClockCircleOutlined />}
                      className="h-12 px-8 bg-white text-blue-600 hover:bg-blue-50 border-0 rounded-lg font-medium">
                      Clock In/Out
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="large" icon={<BarChartOutlined />}
                      className="h-12 px-8 border-white text-white hover:bg-blue-600 hover:border-white rounded-lg font-medium">
                      View Dashboard
                    </Button>
                  </Link>
                </Space>
              ) : (
                <Space size="large">
                  <Link href="/api/auth/login">
                    <Button type="primary" size="large"
                      className="h-12 px-8 bg-white text-blue-600 hover:bg-blue-50 border-0 rounded-lg font-medium">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/api/auth/login">
                    <Button size="large"
                      className="h-12 px-8 border-white text-white hover:bg-blue-600 hover:border-white rounded-lg font-medium">
                      Sign Up
                    </Button>
                  </Link>
                </Space>
              )}
            </Col>
            
            <Col xs={24} lg={12}>
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-lg">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card className="h-full border-0 shadow-md rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      <Statistic 
                        title={<span className="text-blue-500">Average Check-ins</span>}
                        value={98.2}
                        suffix="%"
                        valueStyle={{ color: '#03914f', fontWeight: 'bold' }}
                      />
                      <Text className="text-blue-600">Compliance rate</Text>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card className="h-full border-0 shadow-md rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                      <Statistic 
                        title={<span className="text-indigo-500">Staff Tracking</span>}
                        value={100}
                        suffix="%"
                        valueStyle={{ color: '#03914f', fontWeight: 'bold' }}
                      />
                      <Text className="text-indigo-100">Real-time monitoring</Text>
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card className="h-full border-0 shadow-md rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                      <Statistic 
                        title={<span className="text-blue-500">Time Saved</span>}
                        value={15}
                        suffix="hrs/week"
                        valueStyle={{ color: '#03914f', fontWeight: 'bold' }}
                      />
                      <Text className="text-blue-100">On administrative tasks</Text>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <Title level={2} className="text-3xl font-bold text-center mb-16">
          Designed for Healthcare Professionals
        </Title>
        
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <Card className="h-full hover:shadow-lg transition-shadow border-0 shadow rounded-xl">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <ClockCircleOutlined className="text-3xl" />
                </div>
                <Title level={4}>Easy Clock In/Out</Title>
              </div>
              <Text type="secondary" className="text-center block">
                Simple one-click system with location verification ensures staff are 
                exactly where they need to be when starting shifts.
              </Text>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card className="h-full hover:shadow-lg transition-shadow border-0 shadow rounded-xl">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <EnvironmentOutlined className="text-3xl" />
                </div>
                <Title level={4}>Location Perimeters</Title>
              </div>
              <Text type="secondary" className="text-center block">
                Configure specific geographic boundaries for valid clock-ins, ensuring 
                staff are at designated facilities when they start work.
              </Text>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card className="h-full hover:shadow-lg transition-shadow border-0 shadow rounded-xl">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <BarChartOutlined className="text-3xl" />
                </div>
                <Title level={4}>Real-time Analytics</Title>
              </div>
              <Text type="secondary" className="text-center block">
                Comprehensive dashboards with visual insights into attendance patterns, 
                hours worked, and compliance metrics.
              </Text>
            </Card>
          </Col>
        </Row>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <Title level={2} className="text-3xl font-bold text-center mb-16">
            How It Works
          </Title>
          
          <Row gutter={[48, 48]} justify="center">
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white text-xl font-bold mb-4">
                  1
                </div>
                <Title level={4}>Configure Locations</Title>
                <Text type="secondary">
                  Managers set location perimeters for valid clock-ins at specific facilities
                </Text>
              </div>
            </Col>
            
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white text-xl font-bold mb-4">
                  2
                </div>
                <Title level={4}>Staff Clock In/Out</Title>
                <Text type="secondary">
                  Employees use the app to clock in when they arrive and clock out when they leave
                </Text>
              </div>
            </Col>
            
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white text-xl font-bold mb-4">
                  3
                </div>
                <Title level={4}>Monitor & Analyze</Title>
                <Text type="secondary">
                  Track attendance, generate reports, and optimize staffing based on data
                </Text>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
          <Row gutter={[32, 32]} align="middle" justify="space-between">
            <Col xs={24} md={16}>
              <Title level={3} className="text-white mb-4">
                Ready to streamline your healthcare facility's attendance tracking?
              </Title>
              <Text className="text-blue-100 text-lg">
                Get started today and transform how you manage your healthcare staff.
              </Text>
            </Col>
            <Col xs={24} md={8} className="text-center md:text-right">
              <Link href="/api/auth/login">
                <Button type="primary" size="large"
                  className="h-12 px-8 bg-white text-blue-600 hover:bg-blue-50 border-0 rounded-lg font-medium">
                  Get Started Now
                </Button>
              </Link>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}