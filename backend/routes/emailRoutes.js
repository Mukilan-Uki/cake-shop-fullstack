const express = require('express');
const router = express.Router();
const emailService = require('../utils/emailService');

// Test endpoint
router.post('/test', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email address required'
    });
  }

  const result = await emailService.testEmail(email);
  res.json(result);
});

// Quick test with your email
router.get('/test-email', async (req, res) => {
  const result = await emailService.testEmail('mvasantharaj1972@gmail.com'); // Change to your email
  
  res.json({
    success: result.success,
    message: result.success 
      ? 'Test email sent! Check your inbox (and spam folder).'
      : `Failed: ${result.error?.message || result.error}`,
    details: result
  });
});

// Check configuration
router.get('/config', (req, res) => {
  const config = {
    hasApiKey: !!process.env.RESEND_API_KEY,
    apiKeyLength: process.env.RESEND_API_KEY?.length || 0,
    status: process.env.RESEND_API_KEY ? 'Configured' : 'Not configured'
  };
  
  res.json(config);
});

module.exports = router;