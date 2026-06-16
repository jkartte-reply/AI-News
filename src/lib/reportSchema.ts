import { z } from 'zod';

const SourceSchema = z.object({
  label: z.string(),
  url: z.string(),
});

export const RelevanceSchema = z.enum(['high', 'medium', 'low']);

const ModelItemSchema = z.object({
  name: z.string(),
  provider: z.string(),
  type: z.string(),
  context: z.string().optional(),
  highlight: z.string(),
  relevance: RelevanceSchema,
  sources: z.array(SourceSchema),
});

const FrameworkItemSchema = z.object({
  name: z.string(),
  release: z.string().optional(),
  date: z.string().optional(),
  relevance: RelevanceSchema,
  description: z.string(),
  sources: z.array(SourceSchema),
});

const OpenSourceItemSchema = z.object({
  name: z.string(),
  language_type: z.string().optional(),
  stars: z.string().optional(),
  date: z.string().optional(),
  relevance: RelevanceSchema,
  description: z.string(),
  sources: z.array(SourceSchema),
});

const AzureItemSchema = z.object({
  title: z.string(),
  product: z.string(),
  date: z.string().optional(),
  relevance: RelevanceSchema,
  description: z.string(),
  sources: z.array(SourceSchema),
});

const ProductItemSchema = z.object({
  name: z.string(),
  date: z.string().optional(),
  relevance: RelevanceSchema,
  description: z.string(),
  sources: z.array(SourceSchema),
});

const IndustryItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  sources: z.array(SourceSchema),
});

const BusinessItemSchema = z.object({
  company: z.string(),
  description: z.string(),
  sources: z.array(SourceSchema),
});

function section<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    summary: z.string(),
    items: z.array(itemSchema),
  });
}

export const ReportSidecarSchema = z.object({
  date: z.string(),
  period: z.string(),
  executive_summary: z.object({
    intro: z.string(),
    highlights: z.array(z.string()).min(3).max(5),
  }),
  models: section(ModelItemSchema),
  frameworks: section(FrameworkItemSchema),
  opensource: section(OpenSourceItemSchema),
  azure: section(AzureItemSchema),
  products: section(ProductItemSchema),
  industry: section(IndustryItemSchema),
  business: section(BusinessItemSchema),
});

export type ReportSidecar = z.infer<typeof ReportSidecarSchema>;
export type ModelItem = z.infer<typeof ModelItemSchema>;
export type FrameworkItem = z.infer<typeof FrameworkItemSchema>;
export type AzureItem = z.infer<typeof AzureItemSchema>;
