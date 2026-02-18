
import { z } from 'zod';

// ==========================================
// User Schemas
// ==========================================
export const userSchema = z.object({
    id: z.string().uuid().optional(),
    email: z.string().email("Invalid email address"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    specialty: z.string().optional(),
    practiceName: z.string().optional(),
    avatarUrl: z.string().url().optional().nullable(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type User = z.infer<typeof userSchema>;

// ==========================================
// Patient Schemas
// ==========================================
export const patientSchema = z.object({
    id: z.string().uuid().optional(),
    userId: z.string().uuid(),
    name: z.string().min(2, "Name is required"),
    age: z.coerce.number().min(0).max(150).optional(),
    gender: z.enum(['male', 'female', 'other', 'unknown']).optional(),
    dateOfBirth: z.string().optional(), // ISO date string
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
    diagnoses: z.array(z.string()).default([]),
    medications: z.array(z.string()).default([]),
    allergies: z.array(z.string()).default([]),
    emergencyContact: z.string().optional(),
    emergencyPhone: z.string().optional(),
    insuranceProvider: z.string().optional(),
    insuranceId: z.string().optional(),
    medicalRecordNumber: z.string().optional(),
    notes: z.string().optional(),
    isActive: z.boolean().default(true),
    // Risk assessment
    riskLevel: z.enum(['low', 'medium', 'high', 'critical']).default('low'),
    riskScore: z.number().default(0),
    riskFactors: z.array(z.string()).default([]),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type Patient = z.infer<typeof patientSchema>;

// ==========================================
// Note Schemas
// ==========================================
export const noteContentSchema = z.object({
    subjective: z.string().optional(),
    objective: z.string().optional(),
    assessment: z.string().optional(),
    plan: z.string().optional(),
    icd10: z.string().optional(),
    cpt: z.string().optional(),
});

export const noteSchema = z.object({
    id: z.string().uuid().optional(),
    userId: z.string().uuid(),
    patientId: z.string().uuid().optional().nullable(),
    patientName: z.string().min(1, "Patient name is required"),
    patientAge: z.string().optional(),
    chiefComplaint: z.string().optional(),
    noteType: z.enum(['SOAP', 'Progress', 'Consultation', 'H&P', 'Flexible']).default('SOAP'),
    duration: z.coerce.number().default(0),
    content: noteContentSchema,
    transcription: z.string().optional(),
    audioUrl: z.string().url().optional().nullable(),
    isArchived: z.boolean().default(false),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type Note = z.infer<typeof noteSchema>;

// ==========================================
// Visit Schemas
// ==========================================
export const visitSchema = z.object({
    id: z.string().uuid().optional(),
    patientId: z.string().uuid(),
    userId: z.string().uuid(),
    noteId: z.string().uuid().optional().nullable(),
    visitDate: z.date().default(() => new Date()),
    visitType: z.enum(['routine', 'emergency', 'follow_up', 'telehealth']).default('routine'),
    chiefComplaint: z.string().optional(),
    vitals: z.object({
        bp: z.string().optional(),
        weight: z.coerce.number().optional(),
        height: z.coerce.number().optional(),
        temperature: z.coerce.number().optional(),
        heartRate: z.coerce.number().optional(),
        respiratoryRate: z.coerce.number().optional(),
        oxygenSaturation: z.coerce.number().optional(),
    }).optional(),
    summary: z.string().optional(),
    diagnosis: z.string().optional(),
    treatmentPlan: z.string().optional(),
    followUpDate: z.string().optional(),
    duration: z.coerce.number().default(0),
    status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).default('completed'),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type Visit = z.infer<typeof visitSchema>;

// ==========================================
// Settings Schemas
// ==========================================
export const userSettingsSchema = z.object({
    userId: z.string().uuid(),
    defaultNoteType: z.string().default('SOAP'),
    audioQuality: z.string().default('high'),
    autoSave: z.boolean().default(true),
    darkMode: z.boolean().default(false),
});

export type UserSettings = z.infer<typeof userSettingsSchema>;
