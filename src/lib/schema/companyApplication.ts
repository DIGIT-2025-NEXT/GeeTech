// src/lib/schema/companyApplication.ts

import { z } from 'zod';

export const applicationSchema = z.object({
  companyName: z.string().min(1, '企業名を入力してください'),
  representativeName: z.string().min(1, '代表者名を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  phone: z.string().min(1, '電話番号を入力してください'),
  website: z.string().url('有効なURLを入力してください').optional().or(z.literal('')), 
  industry: z.string().uuid('有効な業界IDを選択してください'),
  employeeCount: z.string().min(1, '従業員数を選択してください'),
  establishedYear: z.string().optional(),
  address: z.string().min(1, '住所を入力してください'),
  description: z.string().min(1, '企業説明を入力してください'),
  businessContent: z.string().optional(),
  is_without_recompense: z.boolean().optional(),
  capital: z.string().optional(),
});

// ステップごとのバリデーションのために、スキーマを部分的に定義します
export const step1Schema = applicationSchema.pick({
    companyName: true,
    representativeName: true,
    email: true,
    phone: true,
    website: true,
});

export const step2Schema = applicationSchema.pick({
    industry: true,
    employeeCount: true,
    address: true,
    description: true,
});

