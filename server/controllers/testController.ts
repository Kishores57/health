import { Request, Response } from 'express';
import { TestModel } from '../models/Test';

export const initTests = async () => {
  const existingTestsCount = await TestModel.countDocuments();
  if (existingTestsCount === 0) {
    try {
      const testsToInsert = [
        { id: 1, name: "Lipid Profile", description: "Measures cholesterol and triglycerides", price: 120000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Heart Health", fastingRequired: true, fastingDuration: 10, isPostprandial: false, notificationsEnabled: true },
        { id: 2, name: "Fasting Blood Sugar (FBS)", description: "Measures blood glucose after an overnight fast", price: 30000, sampleType: "Blood", turnaroundTime: "12 hours", category: "Diabetes", fastingRequired: true, fastingDuration: 8, isPostprandial: false, notificationsEnabled: true },
        { id: 3, name: "Liver Function Test (LFT)", description: "Evaluates liver health", price: 180000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Organ Function", fastingRequired: true, fastingDuration: 10, isPostprandial: false, notificationsEnabled: true },
        { id: 4, name: "Complete Blood Count (CBC)", description: "Evaluates overall health and detects a wide range of disorders", price: 50000, sampleType: "Blood", turnaroundTime: "12 hours", category: "General Health", fastingRequired: false, fastingDuration: 0, isPostprandial: false, notificationsEnabled: true },
        { id: 5, name: "Thyroid Profile (TSH, T3, T4)", description: "Evaluates thyroid gland function", price: 150000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Endocrinology", fastingRequired: true, fastingDuration: 10, isPostprandial: false, notificationsEnabled: true },
        { id: 6, name: "Postprandial Blood Sugar (PPBS)", description: "Measures blood glucose 2 hours after a meal", price: 35000, sampleType: "Blood", turnaroundTime: "12 hours", category: "Diabetes", fastingRequired: false, fastingDuration: 2, isPostprandial: true, notificationsEnabled: true },
        { id: 7, name: "Kidney Function Test (KFT)", description: "Evaluates how well kidneys are working", price: 160000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Organ Function", fastingRequired: true, fastingDuration: 8, isPostprandial: false, notificationsEnabled: true },
        { id: 8, name: "HbA1c (Glycosylated Hemoglobin)", description: "Measures 3-month average blood sugar level", price: 80000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Diabetes", fastingRequired: false, fastingDuration: 0, isPostprandial: false, notificationsEnabled: true },
        { id: 9, name: "Complete Urine Examination (CUE)", description: "Detects and manages a wide range of disorders", price: 20000, sampleType: "Urine", turnaroundTime: "12 hours", category: "General Health", fastingRequired: false, fastingDuration: 0, isPostprandial: false, notificationsEnabled: true },
        { id: 10, name: "Vitamin D (25-OH)", description: "Measures the level of vitamin D in your blood", price: 125000, sampleType: "Blood", turnaroundTime: "24 hours", category: "Vitamins & Minerals", fastingRequired: false, fastingDuration: 0, isPostprandial: false, notificationsEnabled: true }
      ];
      for (let t of testsToInsert) {
        await TestModel.create(t);
      }
      console.log("Seeded default tests successfully");
    } catch (e) {
      console.error('INIT TESTS ERROR:', e);
    }
  }
};

// Get all tests
export const getTests = async (req: Request, res: Response): Promise<void> => {
  try {
    const tests = await TestModel.find({});
    res.json(tests);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new test
export const addTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const lastTest = await TestModel.findOne().sort('-id');
    const nextId = lastTest && lastTest.id ? lastTest.id + 1 : 1;
    
    const test = await TestModel.create({
      ...req.body,
      id: nextId
    });
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
    res.json({ message: 'Test removed' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
