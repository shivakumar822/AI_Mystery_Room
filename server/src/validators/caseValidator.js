import { z } from 'zod';

export const generateCaseSchema = z.object({
  premise: z
    .string({ required_error: 'Premise is required' })
    .trim()
    .min(20, 'Premise must be at least 20 characters long')
    .max(500, 'Premise must be at most 500 characters long'),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    errorMap: () => ({ message: 'Difficulty must be one of: easy, medium, hard' }),
  }),
});

export const accusationSchema = z.object({
  suspectId: z
    .string({ required_error: 'Suspect ID is required' })
    .trim()
    .min(1, 'Suspect ID cannot be empty'),
});

export const geminiMysteryOutputSchema = z.object({
  title: z.string().min(3),
  story: z.string().min(20),
  victim: z.object({
    name: z.string().min(1),
    description: z.string().min(5),
  }),
  suspects: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      description: z.string().min(5),
      motive: z.string().min(5),
      alibi: z.string().min(5),
    })
  ),
  clues: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(5),
      evidence: z.string().min(5),
    })
  ),
  hints: z.array(z.string().min(5)),
  solution: z.object({
    culpritId: z.string().min(1),
    explanation: z.string().min(15),
    reasoning: z.array(z.string().min(5)).min(1),
  }),
}).refine(
  (data) => {
    const suspectIds = data.suspects.map((s) => s.id);
    return suspectIds.includes(data.solution.culpritId);
  },
  {
    message: 'Solution culpritId must match an existing suspect ID',
    path: ['solution', 'culpritId'],
  }
);
