'use client';

import { useEffect } from 'react';
import { Result, Button } from 'antd';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <Result
      status="error"
      title="Something went wrong"
      subTitle={error.message || 'An unexpected error occurred'}
      extra={[
        <Button key="retry" type="primary" onClick={reset}>
          Try Again
        </Button>,
        <Button key="home" onClick={() => router.push('/')}>
          Go Home
        </Button>,
      ]}
    />
  );
} 