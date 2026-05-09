require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('./src/models/Expert');
const Booking = require('./src/models/Booking');

const generateSlots = (startDateStr, numDays = 10) => {
  const slots = [];
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const start = new Date(startDateStr);

  for (let i = 1; i <= numDays + 5; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) continue; // skip weekends
    const dateStr = d.toISOString().split('T')[0];
    times.forEach((time) => slots.push({ date: dateStr, time, isBooked: false }));
  }
  return slots;
};

const BASE_DATE = '2026-05-09';

const experts = [
  {
    name: 'Dr. Sarah Mitchell',
    category: 'Health',
    experience: 12,
    rating: 4.9,
    reviewCount: 234,
    bio: 'Board-certified physician specializing in preventive medicine and wellness optimization. Expert in chronic disease management and holistic health approaches. Helped 500+ patients transform their lifestyle.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=sarah&backgroundColor=b6e3f4',
    hourlyRate: 150,
    availableSlots: generateSlots(BASE_DATE),
  },
  {
    name: 'Alex Chen',
    category: 'Technology',
    experience: 8,
    rating: 4.7,
    reviewCount: 189,
    bio: 'Full-stack engineer and startup CTO with expertise in distributed systems, AI/ML integration, and cloud architecture. Former Google and Meta engineer.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=alex&backgroundColor=c0aede',
    hourlyRate: 200,
    availableSlots: generateSlots(BASE_DATE),
  },
  {
    name: 'Marcus Johnson',
    category: 'Business',
    experience: 15,
    rating: 4.8,
    reviewCount: 312,
    bio: 'Serial entrepreneur and business strategist who has scaled 3 companies to $10M+ ARR. Expert in GTM strategy, fundraising, and operational excellence.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=marcus&backgroundColor=ffd5dc',
    hourlyRate: 250,
    availableSlots: generateSlots(BASE_DATE),
  },
  {
    name: 'Dr. Emily Rodriguez',
    category: 'Finance',
    experience: 10,
    rating: 4.6,
    reviewCount: 156,
    bio: 'CFA charterholder and financial planning expert. Specializes in personal wealth management, tax optimization, and investment portfolio construction for high-net-worth individuals.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=emily&backgroundColor=d1f4d1',
    hourlyRate: 180,
    availableSlots: generateSlots(BASE_DATE),
  },
  {
    name: 'Jennifer Kim',
    category: 'Marketing',
    experience: 7,
    rating: 4.5,
    reviewCount: 98,
    bio: 'Growth marketing expert with a track record of scaling brands from 0 to 1M users. Specializes in content strategy, paid acquisition, and conversion rate optimization.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=jennifer&backgroundColor=ffdfbf',
    hourlyRate: 120,
    availableSlots: generateSlots(BASE_DATE),
  },
  {
    name: 'Robert Taylor',
    category: 'Legal',
    experience: 20,
    rating: 4.9,
    reviewCount: 278,
    bio: 'Senior corporate attorney with two decades of experience in startup law, IP protection, contract negotiation, and M&A transactions. Partner at a Big Law firm for 10 years.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=robert&backgroundColor=c0aede',
    hourlyRate: 300,
    availableSlots: generateSlots(BASE_DATE),
  },
  {
    name: 'David Park',
    category: 'Design',
    experience: 9,
    rating: 4.7,
    reviewCount: 143,
    bio: 'Award-winning product designer and UX strategist. Led design at Airbnb and Figma. Expert in design systems, user research, and building intuitive digital experiences.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=david&backgroundColor=b6e3f4',
    hourlyRate: 160,
    availableSlots: generateSlots(BASE_DATE),
  },
  {
    name: 'Dr. Aisha Patel',
    category: 'Education',
    experience: 14,
    rating: 4.8,
    reviewCount: 201,
    bio: 'EdTech pioneer and curriculum designer with a PhD in Learning Sciences. Specializes in personalized learning, STEM education, and building high-performance learning programs.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=aisha&backgroundColor=ffd5dc',
    hourlyRate: 110,
    availableSlots: generateSlots(BASE_DATE),
  },
  {
    name: 'Michael Torres',
    category: 'Technology',
    experience: 6,
    rating: 4.4,
    reviewCount: 87,
    bio: 'Cybersecurity specialist and ethical hacker. Certified OSCP and CEH. Helps startups and enterprises build robust security postures, conduct pen tests, and achieve compliance.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=michael&backgroundColor=d1f4d1',
    hourlyRate: 175,
    availableSlots: generateSlots(BASE_DATE),
  },
  {
    name: 'Sofia Nakamura',
    category: 'Business',
    experience: 11,
    rating: 4.6,
    reviewCount: 167,
    bio: 'Executive coach and organizational psychologist. Former McKinsey consultant who now helps leaders build resilient teams, navigate change, and accelerate their leadership impact.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=sofia&backgroundColor=ffdfbf',
    hourlyRate: 220,
    availableSlots: generateSlots(BASE_DATE),
  },
  {
    name: 'Dr. James Wilson',
    category: 'Health',
    experience: 18,
    rating: 4.9,
    reviewCount: 321,
    bio: 'Sports medicine physician and performance optimization expert. Team doctor for two Olympic teams. Specializes in injury prevention, athletic performance, and recovery protocols.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=james&backgroundColor=c0aede',
    hourlyRate: 200,
    availableSlots: generateSlots(BASE_DATE),
  },
  {
    name: 'Emma Thompson',
    category: 'Marketing',
    experience: 5,
    rating: 4.3,
    reviewCount: 64,
    bio: 'Social media strategist and brand storyteller. Built viral campaigns for DTC brands with combined reach of 50M+. Specializes in TikTok, Instagram, and influencer marketing.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=emma&backgroundColor=b6e3f4',
    hourlyRate: 95,
    availableSlots: generateSlots(BASE_DATE),
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Expert.deleteMany({});
    await Booking.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const inserted = await Expert.insertMany(experts);
    console.log(`🌱 Seeded ${inserted.length} experts`);

    console.log('\n📋 Expert IDs (save these for testing):');
    inserted.forEach((e) => console.log(`  ${e.name}: ${e._id}`));

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
