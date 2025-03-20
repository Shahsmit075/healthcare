-- Create demo users (if they don't exist)
INSERT INTO "User" ("id", "email", "name", "auth0Id", "role", "createdAt", "updatedAt") 
VALUES 
  ('clnr1demo000001', 'sarah.j@healthcare.demo', 'Sarah Johnson', 'auth0|sarah-demo1', 'CARE_WORKER', NOW(), NOW()),
  ('clnr1demo000002', 'michael.c@healthcare.demo', 'Michael Chen', 'auth0|michael-demo1', 'CARE_WORKER', NOW(), NOW()),
  ('clnr1demo000003', 'emily.r@healthcare.demo', 'Emily Rodriguez', 'auth0|emily-demo1', 'CARE_WORKER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert clock-in records for today and yesterday
INSERT INTO "ClockIn" ("id", "userId", "clockInTime", "clockOutTime", "createdAt", "updatedAt")
VALUES
  -- Sarah's records
  ('clck1demo000001', 'clnr1demo000001', NOW() - INTERVAL '2 hours', NULL, NOW() - INTERVAL '2 hours', NOW()), -- Active session
  ('clck1demo000002', 'clnr1demo000001', NOW() - INTERVAL '1 day' + INTERVAL '9 hours', NOW() - INTERVAL '1 day' + INTERVAL '17 hours', NOW() - INTERVAL '1 day' + INTERVAL '9 hours', NOW() - INTERVAL '1 day' + INTERVAL '17 hours'), -- Yesterday's 8-hour shift

  -- Michael's records
  ('clck1demo000003', 'clnr1demo000002', NOW() - INTERVAL '3 hours', NULL, NOW() - INTERVAL '3 hours', NOW()), -- Active session
  ('clck1demo000004', 'clnr1demo000002', NOW() - INTERVAL '1 day' + INTERVAL '8 hours', NOW() - INTERVAL '1 day' + INTERVAL '18 hours', NOW() - INTERVAL '1 day' + INTERVAL '8 hours', NOW() - INTERVAL '1 day' + INTERVAL '18 hours'), -- Yesterday's 10-hour shift

  -- Emily's records
  ('clck1demo000005', 'clnr1demo000003', NOW() - INTERVAL '1 day' + INTERVAL '7 hours', NOW() - INTERVAL '1 day' + INTERVAL '16 hours', NOW() - INTERVAL '1 day' + INTERVAL '7 hours', NOW() - INTERVAL '1 day' + INTERVAL '16 hours'), -- Yesterday's 9-hour shift
  ('clck1demo000006', 'clnr1demo000003', NOW() - INTERVAL '2 days' + INTERVAL '8 hours', NOW() - INTERVAL '2 days' + INTERVAL '14 hours', NOW() - INTERVAL '2 days' + INTERVAL '8 hours', NOW() - INTERVAL '2 days' + INTERVAL '14 hours'); -- Day before yesterday's 6-hour shift 