import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    filename: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String },
    size: { type: Number },
    mimetype: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Resume', ResumeSchema);
