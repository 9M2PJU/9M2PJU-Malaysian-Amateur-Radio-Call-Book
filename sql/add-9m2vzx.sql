-- Insert 9M2VZX and assign to user email
INSERT INTO public.callsigns (
    callsign,
    name,
    location,
    district,
    phone,
    email,
    address,
    user_id,
    expiry_date,
    added_date,
    created_at
)
VALUES (
    '9M2VZX',
    'AZIRAN ABDUL MAJID',
    'SELANGOR',
    'Petaling',
    '+60192891740',
    'aziranmajid@gmail.com',
    '8, JALAN GUNUNG TAHAN U11/1C, BBSA, SHAH ALAM, 40170 SELANGOR',
    (SELECT id FROM auth.users WHERE email = 'aziranmajid@gmail.com'),
    '2026-12-31',
    NOW(),
    NOW()
)
ON CONFLICT (callsign)
DO UPDATE SET
    name = EXCLUDED.name,
    location = EXCLUDED.location,
    district = EXCLUDED.district,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    address = EXCLUDED.address,
    user_id = EXCLUDED.user_id,
    expiry_date = EXCLUDED.expiry_date;
