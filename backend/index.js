require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Static uploads
const UPLOADS = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS);

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/flipr_demo';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err=> console.error('Mongo connect err', err));

// Models
const { Schema } = mongoose;
const ProjectSchema = new Schema({
  name: String,
  description: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});
const ClientSchema = new Schema({
  name: String,
  designation: String,
  description: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});
const ContactSchema = new Schema({
  fullName: String,
  email: String,
  mobile: String,
  city: String,
  createdAt: { type: Date, default: Date.now }
});
const SubscriberSchema = new Schema({
  email: String,
  createdAt: { type: Date, default: Date.now }
});
const AdminSchema = new Schema({
  username: String,
  passwordHash: String
});

const Project = mongoose.model('Project', ProjectSchema);
const Client = mongoose.model('Client', ClientSchema);
const Contact = mongoose.model('Contact', ContactSchema);
const Subscriber = mongoose.model('Subscriber', SubscriberSchema);
const Admin = mongoose.model('Admin', AdminSchema);

// Simple auth using JWT
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET = process.env.JWT_SECRET || 'verysecretkey';

// Middleware to protect admin routes
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.admin = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Routes: Auth - create default admin via /api/setup-admin if not exists (one-time)
app.post('/api/setup-admin', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username & password required' });
  const exists = await Admin.findOne({ username });
  if (exists) return res.status(400).json({ error: 'admin already exists' });
  const hash = await bcrypt.hash(password, 10);
  const admin = new Admin({ username, passwordHash: hash });
  await admin.save();
  res.json({ ok: true });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ error: 'Invalid' });
  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid' });
  const token = jwt.sign({ id: admin._id, username: admin.username }, SECRET, { expiresIn: '8h' });
  res.json({ token });
});

// Multer + sharp for image upload & crop to 450x350
const multer = require('multer');
const sharp = require('sharp');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS);
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname.replace(/\s+/g,'-');
    cb(null, name);
  }
});
const upload = multer({ storage });

// Projects CRUD
app.get('/api/projects', async (req, res) => {
  const data = await Project.find().sort({ createdAt: -1 });
  res.json(data);
});

app.post('/api/projects', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    let imagePath = '';
    if (req.file) {
      const inPath = req.file.path;
      const outName = 'crop-' + req.file.filename;
      const outPath = path.join(UPLOADS, outName);
      await sharp(inPath).resize(450,350,{fit:'cover'}).toFile(outPath);
      // remove original
      fs.unlinkSync(inPath);
      imagePath = '/uploads/' + outName;
    }
    const p = new Project({ name: req.body.name, description: req.body.description, image: imagePath });
    await p.save();
    res.status(201).json(p);
  } catch (e) {
    console.error(e); res.status(500).json({ error: 'upload error' });
  }
});

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  const doc = await Project.findByIdAndDelete(id);
  res.json({ ok:true, deleted: doc });
});

// Clients
app.get('/api/clients', async (req, res) => {
  const data = await Client.find().sort({ createdAt: -1 });
  res.json(data);
});

app.post('/api/clients', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    let imagePath = '';
    if (req.file) {
      const inPath = req.file.path;
      const outName = 'crop-' + req.file.filename;
      const outPath = path.join(UPLOADS, outName);
      await sharp(inPath).resize(450,350,{fit:'cover'}).toFile(outPath);
      fs.unlinkSync(inPath);
      imagePath = '/uploads/' + outName;
    }
    const c = new Client({ name: req.body.name, designation: req.body.designation, description: req.body.description, image: imagePath });
    await c.save();
    res.status(201).json(c);
  } catch (e) {
    console.error(e); res.status(500).json({ error: 'upload error' });
  }
});

app.delete('/api/clients/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  const doc = await Client.findByIdAndDelete(id);
  res.json({ ok:true, deleted: doc });
});

// Contact form
app.post('/api/contact', async (req, res) => {
  const { fullName, email, mobile, city } = req.body;
  const c = new Contact({ fullName, email, mobile, city });
  await c.save();
  res.status(201).json(c);
});
app.get('/api/contacts', authMiddleware, async (req, res) => {
  const data = await Contact.find().sort({ createdAt: -1 });
  res.json(data);
});

// Subscribers
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  const exists = await Subscriber.findOne({ email });
  if (exists) return res.json({ ok:true, already:true });
  const s = new Subscriber({ email });
  await s.save();
  res.status(201).json(s);
});
app.get('/api/subscribers', authMiddleware, async (req, res) => {
  const data = await Subscriber.find().sort({ createdAt: -1 });
  res.json(data);
});

// Serve uploads statically
app.use('/uploads', express.static(UPLOADS));

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Server running on', PORT));
