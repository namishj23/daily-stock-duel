import { Resend } from 'resend'

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null

interface SendPasswordResetEmailParams {
    email: string
    resetToken: string
    userName?: string
}

export async function sendPasswordResetEmail({
    email,
    resetToken,
    userName,
}: SendPasswordResetEmailParams) {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`

    if (!resend) {
        console.error('Resend is not configured. Please set RESEND_API_KEY in your environment variables.')
        return { success: false, error: 'Email service not configured' }
    }

    try {
        const data = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'StockPredict <onboarding@resend.dev>',
            to: email,
            subject: 'Reset Your Password - StockPredict',
            html: getPasswordResetEmailTemplate(resetUrl, userName || 'User'),
        })

        return { success: true, data }
    } catch (error) {
        console.error('Error sending password reset email:', error)
        return { success: false, error }
    }
}

function getPasswordResetEmailTemplate(resetUrl: string, userName: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔒 Password Reset</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
                We received a request to reset your password for your <strong>StockPredict</strong> account. 
                Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 14px 32px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: 600;
                          font-size: 16px;
                          display: inline-block;
                          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    Reset My Password
                </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                This link will expire in <strong>1 hour</strong> for security reasons.
            </p>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="font-size: 12px; color: #667eea; word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 5px;">
                ${resetUrl}
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                <strong>⚠️ Security Note:</strong> If you didn't request this password reset, 
                please ignore this email or contact our support team if you have concerns.
            </p>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                Thanks,<br>
                <strong>The StockPredict Team</strong>
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2026 StockPredict. Daily Stock Prediction Contest.</p>
        </div>
    </body>
    </html>
    `
}
