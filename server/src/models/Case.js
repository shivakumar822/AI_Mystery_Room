import mongoose from 'mongoose';

const suspectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    motive: { type: String, required: true },
    alibi: { type: String, required: true },
  },
  { _id: false }
);

const clueSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    evidence: { type: String, required: true },
  },
  { _id: false }
);

const solutionSchema = new mongoose.Schema(
  {
    culpritId: { type: String, required: true },
    explanation: { type: String, required: true },
    reasoning: [{ type: String, required: true }],
  },
  { _id: false }
);

const accusationSchema = new mongoose.Schema(
  {
    suspectId: { type: String },
    accusedAt: { type: Date },
  },
  { _id: false }
);

const caseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    story: { type: String, required: true },
    victim: {
      name: { type: String, required: true },
      description: { type: String, required: true },
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    suspects: [suspectSchema],
    clues: [clueSchema],
    hints: [{ type: String }],
    solution: {
      type: solutionSchema,
      required: true,
    },
    discoveredClueIds: {
      type: [String],
      default: [],
    },
    hintsUsed: {
      type: Number,
      default: 0,
    },
    accusation: {
      type: accusationSchema,
      default: null,
    },
    score: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Case = mongoose.model('Case', caseSchema);
