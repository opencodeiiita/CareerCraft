import Resume from '../models/resume.model.js';
import { uploadToCloudinary } from '../middleware/upload.middleware.js';
import { v2 as cloudinary } from 'cloudinary';

export const uploadResume = async (req, res) => {
  console.log('🚀 UPLOAD CONTROLLER HIT - Starting direct Cloudinary upload');
  console.log('=== UPLOAD START ===');
  console.log('Upload request received');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

  try {
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    console.log('✅ Memory file received:', {
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      buffer: req.file.buffer ? 'Buffer present' : 'No buffer'
    });

    // Upload to Cloudinary using direct API
    console.log('🚀 Uploading to Cloudinary...');
    const cloudinaryResult = await uploadToCloudinary(req.file);

    // Extract URL and public_id from Cloudinary response
    const url = cloudinaryResult.secure_url;
    const publicId = cloudinaryResult.public_id;

    console.log('🔗 Extracted URL:', url);
    console.log('🆔 Extracted publicId:', publicId);

    if (!url) {
      console.log('❌ No URL found in Cloudinary response');
      return res.status(500).json({ success: false, message: 'Failed to get file URL from Cloudinary' });
    }


    console.log('💾 Creating resume document...');
    const resume = new Resume({
      userId: req.user?._id,  // Associate resume with authenticated user
      filename: req.file.originalname,
      url,
      publicId,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date()
    });

    console.log('📄 Resume document created:', resume);

    console.log('💾 Saving to database...');
    const savedResume = await resume.save();
    console.log('✅ Resume saved to database:', savedResume);

    const response = {
      success: true,
      resume: {
        id: savedResume._id,
        filename: savedResume.filename,
        url: savedResume.url,
        uploadedAt: savedResume.uploadedAt
      }
    };

    console.log('📤 SENDING RESPONSE NOW:', response);
    return res.json(response);

  } catch (err) {
    console.error('❌ Upload error:', err);
    console.error('❌ Error stack:', err.stack);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

export const deleteResume = async (req, res) => {
  console.log('🗑️ DELETE CONTROLLER HIT');
  console.log('=== DELETE START ===');

  try {
    const { id } = req.params;
    console.log('🆔 Resume ID to delete:', id);

    // Find resume in database
    const resume = await Resume.findById(id);
    if (!resume) {
      console.log('❌ Resume not found in database');
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    console.log('✅ Found resume:', resume);
    console.log('🆔 Cloudinary public ID:', resume.publicId);

    // Delete from Cloudinary
    if (resume.publicId) {
      console.log('🗑️ Deleting from Cloudinary...');
      try {
        await cloudinary.uploader.destroy(resume.publicId, {
          resource_type: resume.mimetype?.startsWith('image/') ? 'image' : 'raw'
        });
        console.log('✅ Deleted from Cloudinary');
      } catch (cloudinaryError) {
        console.error('❌ Cloudinary delete error:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete from database
    console.log('🗑️ Deleting from database...');
    await Resume.findByIdAndDelete(id);
    console.log('✅ Deleted from database');

    console.log('📤 DELETE SUCCESSFUL');
    return res.json({ success: true, message: 'Resume deleted successfully' });

  } catch (err) {
    console.error('❌ Delete error:', err);
    console.error('❌ Error stack:', err.stack);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

export const getResumes = async (req, res) => {
  try {
    // If using auth, filter by user: .find({ user: req.user.id })
    const resumes = await Resume.find().sort({ createdAt: -1 });

    const mapped = resumes.map(r => ({
      id: r._id,
      filename: r.filename,
      url: r.url,
      uploadedAt: r.uploadedAt,
      size: r.size,
      mimetype: r.mimetype
    }));

    return res.json({ success: true, resumes: mapped });
  } catch (err) {
    console.error('List resumes error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
