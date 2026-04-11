import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تأكد من أن مجلد Server وملف db.json موجودان في نفس مسار هذا الملف
// __dirname معرّف فوق من fileURLToPath - ده المسار الصح دايماً
const DB_PATH = new URL('./Server/db.json', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error reading database:', error);
    return { users: [], appointments: [] };
  }
}

async function writeDB(data: any) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('❌ Error writing to database:', error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---

  // 1. جلب قائمة الأطباء
  app.get('/api/doctors', async (req, res) => {
    const db = await readDB();
    const doctors = db.users.filter((u: any) => u.role === 'doctor');
    res.json(doctors);
  });

  // 2. جلب بيانات طبيب محدد (تم إصلاح المقارنة باستخدام String لضمان المطابقة)
  app.get('/api/doctors/:id', async (req, res) => {
    const db = await readDB();
    const doctor = db.users.find(
      (u: any) => String(u.id) === String(req.params.id) && u.role === 'doctor',
    );

    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  });

  // 3. تحديث بيانات الطبيب
  app.put('/api/doctors/:id', async (req, res) => {
    const db = await readDB();
    const index = db.users.findIndex((u: any) => String(u.id) === String(req.params.id));

    if (index !== -1) {
      db.users[index] = { ...db.users[index], ...req.body };
      await writeDB(db);
      res.json(db.users[index]);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  });

  // 4. جلب المواعيد (فلترة ذكية حسب الطبيب أو المريض)
  app.get('/api/appointments', async (req, res) => {
    const db = await readDB();
    const { doctorId, patientId } = req.query;
    let filtered = db.appointments;

    if (doctorId) {
      filtered = filtered.filter((a: any) => String(a.doctorId) === String(doctorId));
    }
    if (patientId) {
      filtered = filtered.filter((a: any) => String(a.patientId) === String(patientId));
    }
    res.json(filtered);
  });

  // 5. جلب بيانات المريض
  app.get('/api/patients/:id', async (req, res) => {
    const db = await readDB();
    const patient = db.users.find(
      (u: any) => String(u.id) === String(req.params.id) && u.role === 'patient',
    );

    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  });

  // 5b. جلب موعد محدد بالـ id
  app.get('/api/appointments/:id', async (req, res) => {
    const db = await readDB();
    const appt = db.appointments.find((a: any) => String(a.id) === String(req.params.id));
    if (appt) {
      res.json(appt);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  });

  // 6. تحديث حالة الموعد
  app.patch('/api/appointments/:id', async (req, res) => {
    const db = await readDB();
    const index = db.appointments.findIndex((a: any) => String(a.id) === String(req.params.id));

    if (index !== -1) {
      db.appointments[index] = { ...db.appointments[index], ...req.body };
      await writeDB(db);
      res.json(db.appointments[index]);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  });

  // 7. جلب كل المستخدمين (للـ getAllPatients في الـ service)
  app.get('/api/users', async (req, res) => {
    const db = await readDB();
    res.json(db.users);
  });

  // --- Static Files & Angular Routing ---

  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));

  app.get('/{*splat}', (req, res) => {
    if (req.url.startsWith('/api')) {
      return res.status(404).json({ message: 'API Route not found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📁 Database path: ${DB_PATH}`);
  });
}

startServer();
