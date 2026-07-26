import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(2),
  email: z.string().email("Invalid Email"),
  password: z.string().min(8),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid Email"), 
  password: z.string().min(8),
});

// ================== TRANSACTION SCHEMA ==================
const TransactionSchema = z.object({
  date: z.string(),
  amount: z.number(),
  merchant: z.string(),
  category: z.string(),
  notes: z.string().optional().default(''),
});

// ================== RESPONSE SCHEMA (This is what AI needs) ==================
export const ResponseSchema = z.object({
  transactions: z.array(TransactionSchema),
  summary: z.object({
    totalSpent: z.number(),
    topCategories: z.record(z.string(), z.number()),
  }),
  insights: z.string().optional().default(''),
  suggestions: z.array(z.string()).optional().default([]),
  savingTips: z.array(z.string()),
});

// ================== TYPES ==================
export type RegisterInput = z.infer<typeof registerSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type TransactionInput = z.infer<typeof TransactionSchema>;
export type ResponseInput = z.infer<typeof ResponseSchema>;