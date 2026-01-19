const { Resend } = require('resend');

class EmailService {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromEmail = 'Cube Cake <onboarding@resend.dev>';
  }

  // Format date nicely
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Format time
  formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Send order confirmation email
  async sendOrderConfirmation(order) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: order.email,
        subject: `🎂 Your Cake Order #${order.orderId} is Confirmed!`,
        html: this.createOrderEmailHTML(order),
        text: this.createOrderEmailText(order), // Fallback for plain text
        reply_to: 'mvasantharaj1972@gmail.com'
      });

      if (error) {
        console.error('❌ Email error:', error);
        return { success: false, error };
      }

      console.log('✅ Email sent to:', order.email, 'ID:', data.id);
      return { success: true, emailId: data.id };
      
    } catch (error) {
      console.error('❌ Email failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Create beautiful HTML email
  createOrderEmailHTML(order) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cube Cake Order Confirmation</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #4A2C2A;
            margin: 0;
            padding: 20px;
            background-color: #FFF9F5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #FF9E6D 0%, #FF6B8B 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            font-family: 'Dancing Script', cursive;
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .order-id {
            background: rgba(255,255,255,0.2);
            padding: 10px 20px;
            border-radius: 50px;
            display: inline-block;
            font-weight: bold;
            margin-top: 10px;
        }
        .content {
            padding: 30px;
        }
        .section {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .section-title {
            color: #FF6B8B;
            font-size: 18px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .section-title i {
            font-size: 20px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .info-item {
            background: #FFF5E6;
            padding: 15px;
            border-radius: 10px;
        }
        .info-label {
            font-size: 12px;
            color: #999;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .info-value {
            font-weight: bold;
            color: #4A2C2A;
        }
        .cake-details {
            background: #FFF5E6;
            padding: 20px;
            border-radius: 10px;
        }
        .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #FFD9C9;
        }
        .detail-item:last-child {
            border-bottom: none;
        }
        .footer {
            background: #4A2C2A;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        .contact-item {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .status-badge {
            display: inline-block;
            background: #FF9E6D;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
        }
        @media (max-width: 600px) {
            .container {
                border-radius: 0;
            }
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">Cube Cake</div>
            <h1 style="margin: 10px 0 0 0; font-size: 28px;">Order Confirmed!</h1>
            <p style="opacity: 0.9; margin: 5px 0 20px 0;">Thank you for your order</p>
            <div class="order-id">ORDER #${order.orderId}</div>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Customer Info -->
            <div class="section">
                <div class="section-title">
                    <span style="font-size: 24px;">👤</span>
                    <span>Customer Information</span>
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Customer Name</div>
                        <div class="info-value">${order.customerName}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Phone Number</div>
                        <div class="info-value">${order.phone}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email</div>
                        <div class="info-value">${order.email}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Order Date</div>
                        <div class="info-value">${this.formatDate(order.createdAt)}</div>
                    </div>
                </div>
            </div>

            <!-- Order Status -->
            <div class="section">
                <div class="section-title">
                    <span style="font-size: 24px;">📋</span>
                    <span>Order Status</span>
                </div>
                <div style="text-align: center; padding: 20px;">
                    <div class="status-badge">${order.status || 'Preparing'}</div>
                    <p style="margin-top: 10px; color: #666;">
                        Estimated preparation time: <strong>3-4 hours</strong><br>
                        We'll notify you when your cake is ready
                    </p>
                </div>
            </div>

            <!-- Cake Design -->
            <div class="section">
                <div class="section-title">
                    <span style="font-size: 24px;">🍰</span>
                    <span>Your Cake Design</span>
                </div>
                <div class="cake-details">
                    <div class="detail-item">
                        <span>Cake Base:</span>
                        <span><strong>${order.base || 'Custom'}</strong></span>
                    </div>
                    <div class="detail-item">
                        <span>Frosting:</span>
                        <span><strong>${order.frosting || 'Custom'}</strong></span>
                    </div>
                    <div class="detail-item">
                        <span>Size:</span>
                        <span><strong>${order.size || 'Medium'}</strong></span>
                    </div>
                    <div class="detail-item">
                        <span>Layers:</span>
                        <span><strong>${order.layers || 2}</strong></span>
                    </div>
                    ${order.toppings?.length ? `
                    <div class="detail-item">
                        <span>Toppings:</span>
                        <span><strong>${order.toppings.length} selected</strong></span>
                    </div>
                    ` : ''}
                    ${order.message ? `
                    <div class="detail-item">
                        <span>Custom Message:</span>
                        <span><strong>"${order.message}"</strong></span>
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- Delivery Information -->
            <div class="section">
                <div class="section-title">
                    <span style="font-size: 24px;">📅</span>
                    <span>Delivery Information</span>
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Delivery Date</div>
                        <div class="info-value">${this.formatDate(order.deliveryDate)}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Delivery Type</div>
                        <div class="info-value">
                            ${order.deliveryType === 'delivery' ? '🚚 Home Delivery' : '🏪 Store Pickup'}
                        </div>
                    </div>
                    ${order.deliveryType === 'delivery' && order.deliveryAddress ? `
                    <div class="info-item" style="grid-column: span 2;">
                        <div class="info-label">Delivery Address</div>
                        <div class="info-value">${order.deliveryAddress}</div>
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- Payment Summary -->
            <div class="section" style="border-bottom: none;">
                <div class="section-title">
                    <span style="font-size: 24px;">💰</span>
                    <span>Payment Summary</span>
                </div>
                <div style="background: linear-gradient(135deg, #FFF5E6 0%, #FFEBD6 100%); 
                         padding: 20px; border-radius: 10px;">
                    <div style="display: flex; justify-content: space-between; 
                             font-size: 24px; font-weight: bold; color: #FF6B8B;">
                        <span>Total Amount:</span>
                        <span>$${order.totalPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div style="margin-top: 10px; color: #666;">
                        Payment Method: ${order.paymentMethod === 'cash' ? '💵 Cash' : '💳 Card/Online'}
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <h3 style="margin: 0 0 20px 0;">Cube Cake Shop</h3>
            <p style="margin: 0 0 20px 0; opacity: 0.8;">
                Where cakes transform into edible masterpieces
            </p>
            
            <div class="contact-info">
                <div class="contact-item">
                    <span style="font-size: 20px;">📍</span>
                    <div>
                        <div style="font-weight: bold;">Our Location</div>
                        <div style="font-size: 14px; opacity: 0.8;">
                            Main Street, Santhively<br>Batticaloa
                        </div>
                    </div>
                </div>
                
                <div class="contact-item">
                    <span style="font-size: 20px;">📞</span>
                    <div>
                        <div style="font-weight: bold;">Contact Us</div>
                        <div style="font-size: 14px; opacity: 0.8;">
                            0743086099<br>
                            hello@cubecake.com
                        </div>
                    </div>
                </div>
                
                <div class="contact-item">
                    <span style="font-size: 20px;">🕒</span>
                    <div>
                        <div style="font-weight: bold;">Business Hours</div>
                        <div style="font-size: 14px; opacity: 0.8;">
                            Mon-Sun: 8AM - 8PM<br>
                            Delivery: 10AM - 6PM
                        </div>
                    </div>
                </div>
            </div>
            
            <p style="margin-top: 30px; opacity: 0.6; font-size: 14px;">
                This is an automated email. Please do not reply directly.<br>
                For any questions, contact us at 0743086099
            </p>
        </div>
    </div>
</body>
</html>
    `;
  }

  // Plain text version (for email clients that don't support HTML)
  createOrderEmailText(order) {
    return `
CUBE CAKE ORDER CONFIRMATION
=============================

Order ID: ${order.orderId}
Customer: ${order.customerName}
Phone: ${order.phone}
Email: ${order.email}
Order Date: ${this.formatDate(order.createdAt)} at ${this.formatTime(order.createdAt)}

ORDER STATUS: ${order.status || 'Preparing'}
Estimated preparation time: 3-4 hours

YOUR CAKE DESIGN:
-----------------
Base: ${order.base || 'Custom'}
Frosting: ${order.frosting || 'Custom'}
Size: ${order.size || 'Medium'}
Layers: ${order.layers || 2}
${order.toppings?.length ? `Toppings: ${order.toppings.length} selected` : ''}
${order.message ? `Custom Message: "${order.message}"` : ''}

DELIVERY INFORMATION:
---------------------
Date: ${this.formatDate(order.deliveryDate)}
Type: ${order.deliveryType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
${order.deliveryAddress ? `Address: ${order.deliveryAddress}` : ''}

PAYMENT SUMMARY:
----------------
Total Amount: $${order.totalPrice?.toFixed(2) || '0.00'}
Payment Method: ${order.paymentMethod === 'cash' ? 'Cash' : 'Card/Online'}

STORE INFORMATION:
------------------
Cube Cake Shop
Main Street, Santhively, Batticaloa
Phone: 0743086099
Email: hello@cubecake.com
Hours: Mon-Sun 8AM-8PM

Thank you for choosing Cube Cake! We'll notify you when your cake is ready.

This is an automated email. For questions, contact us at 0743086099.
    `;
  }

  // Send order status update
  async sendStatusUpdate(order, newStatus) {
    const statusMessages = {
      'Preparing': 'Your cake is being prepared by our bakers!',
      'Ready': 'Your cake is ready for pickup!',
      'Completed': 'Thank you for choosing Cube Cake! Enjoy your cake!',
      'Cancelled': 'Your order has been cancelled. Contact us for assistance.'
    };

    const { data, error } = await this.resend.emails.send({
      from: this.fromEmail,
      to: order.email,
      subject: `🔄 Order #${order.orderId} Status Update: ${newStatus}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF9E6D, #FF6B8B); 
                   color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">Order Status Updated</h1>
          </div>
          <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px;">
            <h2>Order #${order.orderId}</h2>
            <p>Status changed to: <strong>${newStatus}</strong></p>
            <p>${statusMessages[newStatus] || ''}</p>
            <p>Customer: ${order.customerName}</p>
            <p>Delivery: ${this.formatDate(order.deliveryDate)}</p>
            <div style="margin-top: 30px; padding: 20px; background: #FFF5E6; border-radius: 10px;">
              <p><strong>Need help?</strong></p>
              <p>Contact us: 0743086099 | hello@cubecake.com</p>
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Status email error:', error);
      return { success: false, error };
    }

    return { success: true, emailId: data.id };
  }

  // Test email
  async testEmail(testEmail = 'your-email@gmail.com') {
    const testOrder = {
      orderId: 'TEST-' + Date.now(),
      customerName: 'Test Customer',
      phone: '0743086099',
      email: testEmail,
      base: 'Chocolate',
      frosting: 'Vanilla',
      size: 'Medium',
      layers: 3,
      message: 'Happy Birthday!',
      deliveryDate: new Date(Date.now() + 86400000).toISOString(),
      deliveryType: 'pickup',
      totalPrice: 45.99,
      status: 'Preparing',
      createdAt: new Date().toISOString()
    };

    return await this.sendOrderConfirmation(testOrder);
  }
}

module.exports = new EmailService();