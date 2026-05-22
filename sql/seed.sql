-- Healthcare SaaS Dashboard — Seed Data
-- Run this AFTER migrations.sql to populate tables with sample data.
-- Or use the TypeScript seed: import { seedDatabase } from '@/lib/supabase'

-- ============= SAMPLE PATIENTS =============
insert into patients (id, first_name, last_name, email, phone_number, date_of_birth, gender, status, blood_type, allergies, emergency_contact, address, insurance_provider, insurance_id, tags, last_visit) values
  ('PAT-1001', 'Olivia', 'Martin', 'olivia.martin@email.com', '+1 555 0145', '1985-03-12', 'female', 'active', 'A+', '{Penicillin}', '{"name":"James Martin","phone":"+1 555 0146","relationship":"Spouse"}', '123 Main St, Portland, OR 97201', 'Blue Cross', 'BC-88472-MED', '{chronic,follow-up}', '2026-05-15T10:30:00Z'),
  ('PAT-1002', 'Jackson', 'Lee', 'jackson.lee@email.com', '+1 555 0173', '1972-08-25', 'male', 'active', 'O+', '{}', '{"name":"Sarah Lee","phone":"+1 555 0174","relationship":"Spouse"}', '456 Oak Ave, Portland, OR 97202', 'Aetna', 'AET-99123-DENT', '{high-risk}', '2026-05-12T14:00:00Z'),
  ('PAT-1003', 'Isabella', 'Nguyen', 'isabella.nguyen@email.com', '+1 555 0198', '1995-11-03', 'female', 'active', 'B+', '{Sulfa}', '{"name":"Mike Nguyen","phone":"+1 555 0199","relationship":"Brother"}', '789 Pine Rd, Portland, OR 97203', 'Kaiser', 'KSR-44781-VIS', '{new-patient}', '2026-05-18T09:15:00Z'),
  ('PAT-1004', 'William', 'Kim', 'william.kim@email.com', '+1 555 0210', '1968-01-30', 'male', 'active', 'AB-', '{Aspirin,Ibuprofen}', '{"name":"Emily Kim","phone":"+1 555 0211","relationship":"Daughter"}', '321 Elm St, Portland, OR 97204', 'Cigna', 'CGN-33456-PHARM', '{chronic,medication-review}', '2026-05-10T11:30:00Z'),
  ('PAT-1005', 'Sofia', 'Davis', 'sofia.davis@email.com', '+1 555 0234', '1990-06-18', 'female', 'active', 'A-', '{}', '{"name":"Tom Davis","phone":"+1 555 0235","relationship":"Spouse"}', '654 Maple Dr, Portland, OR 97205', 'United Health', 'UH-55678-WELL', '{telehealth}', '2026-05-17T16:45:00Z');

-- ============= SAMPLE DOCTORS =============
insert into doctors (id, name, specialty, specializations, email, phone_number, bio, education, experience_years, status, availability, rating, consultation_fee, department, languages) values
  ('DOC-1001', 'Dr. Aisha Rao', 'Primary Care', '{Internal Medicine,Geriatrics}', 'aisha.rao@clinic.com', '+1 555 1001', 'Experienced primary care physician with a focus on preventive medicine.', 'MD, Harvard Medical School', 15, 'active', 'available', 4.8, 150, 'Primary Care', '{English,Hindi}'),
  ('DOC-1002', 'Dr. Marcus Chen', 'Cardiology', '{Interventional Cardiology,Echocardiography}', 'marcus.chen@clinic.com', '+1 555 1002', 'Board-certified cardiologist specializing in interventional procedures.', 'MD, Johns Hopkins University School of Medicine', 20, 'active', 'busy', 4.9, 350, 'Cardiology', '{English,Mandarin}'),
  ('DOC-1003', 'Dr. Sarah Mitchell', 'Dermatology', '{Cosmetic Dermatology,Pediatric Dermatology}', 'sarah.mitchell@clinic.com', '+1 555 1003', 'Dermatologist with expertise in both medical and cosmetic procedures.', 'MD, Stanford University School of Medicine', 12, 'active', 'available', 4.7, 200, 'Dermatology', '{English,Spanish}'),
  ('DOC-1004', 'Dr. James Okafor', 'Orthopedics', '{Sports Medicine,Joint Replacement}', 'james.okafor@clinic.com', '+1 555 1004', 'Orthopedic surgeon specializing in sports injuries and joint replacement.', 'MD, Mayo Clinic Alix School of Medicine', 18, 'active', 'available', 4.6, 300, 'Orthopedics', '{English,French}'),
  ('DOC-1005', 'Dr. Elena Torres', 'Pediatrics', '{Neonatology,Adolescent Medicine}', 'elena.torres@clinic.com', '+1 555 1005', 'Compassionate pediatrician dedicated to children''s health and development.', 'MD, University of California San Francisco', 10, 'active', 'available', 4.8, 175, 'Pediatrics', '{English,Spanish}');

-- ============= SAMPLE APPOINTMENTS =============
insert into appointments (id, patient, doctor, date, time, duration, type, status, priority, department, notes, specialty) values
  ('APT-1024', '{"id":"PAT-1001","name":"Olivia Martin","email":"olivia.martin@email.com","phone":"+1 555 0145","avatar":""}', 'Dr. Aisha Rao', '2026-05-19', '09:00 AM', 30, 'Check-up', 'checked-in', 'normal', 'Primary Care', 'Annual physical examination', 'Primary Care'),
  ('APT-1025', '{"id":"PAT-1002","name":"Jackson Lee","email":"jackson.lee@email.com","phone":"+1 555 0173","avatar":""}', 'Dr. Marcus Chen', '2026-05-19', '10:30 AM', 45, 'Consultation', 'scheduled', 'urgent', 'Cardiology', 'Chest pain follow-up', 'Cardiology'),
  ('APT-1026', '{"id":"PAT-1003","name":"Isabella Nguyen","email":"isabella.nguyen@email.com","phone":"+1 555 0198","avatar":""}', 'Dr. Sarah Mitchell', '2026-05-20', '02:00 PM', 30, 'Follow-up', 'scheduled', 'normal', 'Dermatology', 'Skin rash re-evaluation', 'Dermatology'),
  ('APT-1027', '{"id":"PAT-1004","name":"William Kim","email":"william.kim@email.com","phone":"+1 555 0210","avatar":""}', 'Dr. James Okafor', '2026-05-20', '11:00 AM', 60, 'Procedure', 'scheduled', 'high', 'Orthopedics', 'Knee injection', 'Orthopedics'),
  ('APT-1028', '{"id":"PAT-1005","name":"Sofia Davis","email":"sofia.davis@email.com","phone":"+1 555 0234","avatar":""}', 'Dr. Elena Torres', '2026-05-21', '03:30 PM', 30, 'Telehealth', 'scheduled', 'normal', 'Pediatrics', 'Well-child visit', 'Pediatrics');

-- ============= SAMPLE CONVERSATIONS =============
insert into conversations (id, patient, patient_id, status, priority, unread, last_message, last_time) values
  ('conv-001', 'Olivia Martin', 'PAT-1001', 'needs-review', 'urgent', 2, 'I have been experiencing chest tightness since yesterday.', '5m ago'),
  ('conv-002', 'Jackson Lee', 'PAT-1002', 'needs-review', 'high', 1, 'My blood pressure readings have been elevated this week.', '12m ago'),
  ('conv-003', 'Isabella Nguyen', 'PAT-1003', 'ai-drafted', 'normal', 0, 'The rash is improving with the prescribed cream.', '1h ago'),
  ('conv-004', 'William Kim', 'PAT-1004', 'resolved', 'low', 0, 'Thank you for the prescription refill.', '2d ago'),
  ('conv-005', 'Sofia Davis', 'PAT-1005', 'ai-drafted', 'normal', 1, 'Can I reschedule my appointment to next week?', '3h ago');

-- ============= SAMPLE MESSAGES =============
insert into messages (id, conversation_id, author, text, time) values
  ('m-001', 'conv-001', 'patient', 'I have been experiencing chest tightness since yesterday.', '09:15 AM'),
  ('m-002', 'conv-001', 'staff', 'Thank you for letting us know. How long does the tightness last?', '09:20 AM'),
  ('m-003', 'conv-001', 'patient', 'About 10-15 minutes each time. It happens when I walk upstairs.', '09:22 AM'),
  ('m-004', 'conv-001', 'ai', 'Draft reply: Based on the symptoms described, I recommend scheduling an in-person evaluation.', '09:25 AM'),
  ('m-005', 'conv-002', 'patient', 'My blood pressure readings have been elevated this week.', '10:30 AM'),
  ('m-006', 'conv-002', 'ai', 'Draft reply: Please monitor your BP twice daily and keep a log.', '10:32 AM'),
  ('m-007', 'conv-003', 'patient', 'The rash is improving with the prescribed cream.', '02:00 PM'),
  ('m-008', 'conv-003', 'staff', 'Great to hear! Continue using it as directed for the full course.', '02:15 PM'),
  ('m-009', 'conv-004', 'patient', 'Thank you for the prescription refill.', '11:00 AM'),
  ('m-010', 'conv-004', 'staff', 'You are welcome! Please pick it up at your pharmacy.', '11:05 AM'),
  ('m-011', 'conv-005', 'patient', 'Can I reschedule my appointment to next week?', '03:00 PM'),
  ('m-012', 'conv-005', 'ai', 'Draft reply: We have availability on Tuesday at 10 AM or Thursday at 2 PM.', '03:02 PM');

-- ============= SAMPLE MEDICAL NOTES =============
insert into medical_notes (id, patient_id, title, content, type, created_by) values
  ('NOTE-10001', 'PAT-1001', 'Routine Check-up', 'Patient is in good health. Blood pressure 120/80. Recommended continuing current medication regimen. Annual lab work ordered.', 'general', 'Dr. Aisha Rao'),
  ('NOTE-10002', 'PAT-1002', 'Cardiology Follow-up', 'Echocardiogram shows improved ejection fraction. Continue current medications. Follow up in 3 months.', 'prescription', 'Dr. Marcus Chen'),
  ('NOTE-10003', 'PAT-1003', 'Dermatology Referral', 'Referred to dermatology for persistent skin rash. Initial treatment with hydrocortisone cream. Follow up in 2 weeks.', 'referral', 'Dr. Aisha Rao'),
  ('NOTE-10004', 'PAT-1004', 'Lab Results Review', 'LDL cholesterol elevated at 160 mg/dL. Discussed dietary modifications. Repeat labs in 3 months.', 'lab_result', 'Dr. Sarah Mitchell');

-- ============= SAMPLE VISITS =============
insert into visits (id, patient_id, date, type, doctor, department, reason, diagnosis, status) values
  ('VIS-10001', 'PAT-1001', '2026-04-15', 'Check-up', 'Dr. Aisha Rao', 'Primary Care', 'Annual physical examination', 'Essential hypertension, well-controlled', 'completed'),
  ('VIS-10002', 'PAT-1002', '2026-05-10', 'Follow-up', 'Dr. Marcus Chen', 'Cardiology', 'Chest pain evaluation', 'Stable angina', 'completed'),
  ('VIS-10003', 'PAT-1003', '2026-05-01', 'Consultation', 'Dr. Sarah Mitchell', 'Dermatology', 'Skin rash on arms and torso', 'Contact dermatitis', 'completed'),
  ('VIS-10004', 'PAT-1004', '2026-04-28', 'Follow-up', 'Dr. James Okafor', 'Orthopedics', 'Right knee pain', 'Mild osteoarthritis', 'completed'),
  ('VIS-10005', 'PAT-1005', '2026-05-05', 'Check-up', 'Dr. Elena Torres', 'Pediatrics', 'Well-child check', '', 'completed');

-- ============= SAMPLE NOTIFICATIONS =============
insert into notifications (id, type, title, description, priority, read, patient_id, patient_name) values
  ('notif-1001', 'message', 'New message from Olivia Martin', 'I have been experiencing chest tightness since yesterday.', 'urgent', false, 'PAT-1001', 'Olivia Martin'),
  ('notif-1002', 'alert', 'Abnormal lab result flag', 'William Kim — LDL cholesterol elevated at 160 mg/dL.', 'high', false, 'PAT-1004', 'William Kim'),
  ('notif-1003', 'appointment', 'Appointment confirmed', 'Sofia Davis — Tomorrow at 3:30 PM with Dr. Elena Torres.', 'normal', false, 'PAT-1005', 'Sofia Davis'),
  ('notif-1004', 'reminder', 'Appointment reminder: Tomorrow', 'You have a Check-up with Dr. Aisha Rao at 9:00 AM.', 'normal', true, 'PAT-1001', 'Olivia Martin'),
  ('notif-1005', 'lab_result', 'Lab results ready — Jackson Lee', 'CBC and Lipid Panel results are available for review.', 'high', false, 'PAT-1002', 'Jackson Lee'),
  ('notif-1006', 'system', 'Weekly report ready', 'Your department summary for this week has been generated.', 'low', true, null, null);

-- ============= ENABLE REALTIME (required for subscriptions) =============
-- Uncomment after tables are created:
-- alter publication supabase_realtime add table patients, doctors, appointments, conversations, messages, medical_notes, visits, notifications;
