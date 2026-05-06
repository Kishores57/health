import { Request, Response } from 'express';
import { TestModel } from '../models/Test';

// ── In-memory cache for test list (5-minute TTL) ─────────────────────────────
let testsCache: { data: any[] | null; expiresAt: number } = { data: null, expiresAt: 0 };
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function invalidateTestsCache() {
  testsCache = { data: null, expiresAt: 0 };
}

export const initTests = async () => {
  // ── Canonical test data (prices in paise, i.e. ₹1 = 100) ─────────────────
  // Uses upsert so corrections apply to both fresh and existing databases.
  const canonicalTests = [
    {
      id: 1,
      name: "Lipid Profile",
      description: "Measures total cholesterol, HDL, LDL, and triglycerides to assess cardiovascular health",
      price: 60000,           // ₹600 — standard private lab rate
      sampleType: "Blood",
      turnaroundTime: "24 hours",
      category: "Heart Health",
      fastingRequired: true,
      fastingDuration: 10,    // 9–12 hrs recommended
      isPostprandial: false,
      notificationsEnabled: true,
    },
    {
      id: 2,
      name: "Fasting Blood Sugar (FBS)",
      description: "Measures blood glucose levels after an overnight fast to screen for diabetes",
      price: 10000,           // ₹100 — standard rate
      sampleType: "Blood",
      turnaroundTime: "12 hours",
      category: "Diabetes",
      fastingRequired: true,
      fastingDuration: 8,     // minimum 8 hrs fasting required
      isPostprandial: false,
      notificationsEnabled: true,
    },
    {
      id: 3,
      name: "Liver Function Test (LFT)",
      description: "Evaluates liver health by measuring enzymes, proteins, and bilirubin levels",
      price: 80000,           // ₹800 — standard private lab rate
      sampleType: "Blood",
      turnaroundTime: "24 hours",
      category: "Organ Function",
      fastingRequired: true,
      fastingDuration: 10,    // 8–12 hrs recommended
      isPostprandial: false,
      notificationsEnabled: true,
    },
    {
      id: 4,
      name: "Complete Blood Count (CBC)",
      description: "Evaluates overall health and detects a wide range of disorders including anaemia and infection",
      price: 20000,           // ₹200 — standard rate
      sampleType: "Blood",
      turnaroundTime: "12 hours",
      category: "General Health",
      fastingRequired: false, // no fasting needed
      fastingDuration: 0,
      isPostprandial: false,
      notificationsEnabled: true,
    },
    {
      id: 5,
      name: "Thyroid Profile (TSH, T3, T4)",
      description: "Evaluates thyroid gland function by measuring hormone levels in the blood",
      price: 65000,           // ₹650 — standard private lab rate
      sampleType: "Blood",
      turnaroundTime: "24 hours",
      category: "Endocrinology",
      fastingRequired: false, // ✅ FIX: Thyroid tests do NOT require fasting
      fastingDuration: 0,
      isPostprandial: false,
      notificationsEnabled: true,
    },
    {
      id: 6,
      name: "Postprandial Blood Sugar (PPBS)",
      description: "Measures blood glucose exactly 2 hours after a meal to monitor diabetes management",
      price: 10000,           // ₹100 — standard rate
      sampleType: "Blood",
      turnaroundTime: "12 hours",
      category: "Diabetes",
      fastingRequired: false,
      fastingDuration: 2,     // 2 hrs after eating (post-meal window)
      isPostprandial: true,
      notificationsEnabled: true,
    },
    {
      id: 7,
      name: "Kidney Function Test (KFT)",
      description: "Evaluates kidney health by measuring creatinine, urea, uric acid and electrolytes",
      price: 70000,           // ₹700 — standard private lab rate
      sampleType: "Blood",
      turnaroundTime: "24 hours",
      category: "Organ Function",
      fastingRequired: true,
      fastingDuration: 8,     // 8–12 hrs recommended
      isPostprandial: false,
      notificationsEnabled: true,
    },
    {
      id: 8,
      name: "HbA1c (Glycosylated Hemoglobin)",
      description: "Measures average blood sugar level over the past 2–3 months for long-term diabetes monitoring",
      price: 50000,           // ₹500 — standard rate
      sampleType: "Blood",
      turnaroundTime: "24 hours",
      category: "Diabetes",
      fastingRequired: false, // no fasting needed
      fastingDuration: 0,
      isPostprandial: false,
      notificationsEnabled: true,
    },
    {
      id: 9,
      name: "Complete Urine Examination (CUE)",
      description: "Screens for kidney disorders, urinary tract infections, and metabolic conditions",
      price: 15000,           // ₹150 — standard rate
      sampleType: "Urine",
      turnaroundTime: "12 hours",
      category: "General Health",
      fastingRequired: false, // no fasting needed
      fastingDuration: 0,
      isPostprandial: false,
      notificationsEnabled: true,
    },
    {
      id: 10,
      name: "Vitamin D (25-OH)",
      description: "Measures the level of Vitamin D in blood to detect deficiency or toxicity",
      price: 120000,          // ₹1,200 — standard private lab rate (HPLC method)
      sampleType: "Blood",
      turnaroundTime: "24 hours",
      category: "Vitamins & Minerals",
      fastingRequired: false, // no fasting needed
      fastingDuration: 0,
      isPostprandial: false,
      notificationsEnabled: true,
    },
  ];

  try {
    // Upsert each test so corrections apply to existing records too
    for (const t of canonicalTests) {
      await TestModel.updateOne(
        { id: t.id },
        { $set: t },
        { upsert: true }
      );
    }
    // Bust the in-memory cache so fresh data is served immediately
    invalidateTestsCache();
    console.log("✅ Tests initialised / updated with correct data.");
  } catch (e) {
    console.error('INIT TESTS ERROR:', e);
  }
};

// Get all tests
export const getTests = async (req: Request, res: Response): Promise<void> => {
  try {
    // ── Serve from cache if still fresh ──────────────────────────────────────
    const now = Date.now();
    if (testsCache.data && now < testsCache.expiresAt) {
      res.set('X-Cache', 'HIT');
      res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      res.json(testsCache.data);
      return;
    }

    const tests = await TestModel.find({}).lean();

    // ── Store in cache ────────────────────────────────────────────────────────
    testsCache = { data: tests, expiresAt: now + CACHE_TTL_MS };

    res.set('X-Cache', 'MISS');
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(tests);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new test
export const addTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const lastTest = await TestModel.findOne().sort('-id').lean();
    const nextId = lastTest && lastTest.id ? lastTest.id + 1 : 1;
    
    const test = await TestModel.create({
      ...req.body,
      id: nextId
    });
    invalidateTestsCache(); // ← bust the cache
    res.status(201).json(test);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Update a test
export const updateTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const test = await TestModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!test) {
      res.status(404).json({ message: 'Test not found' });
      return;
    }
    invalidateTestsCache(); // ← bust the cache
    res.json(test);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a test
export const deleteTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const test = await TestModel.findByIdAndDelete(id);
    if (!test) {
      res.status(404).json({ message: 'Test not found' });
      return;
    }
    invalidateTestsCache(); // ← bust the cache
    res.json({ message: 'Test removed' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
