import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


def _send_email(to_email: str, subject: str, html_body: str, text_body: str = "") -> bool:
    """
    Core email sender using Gmail SMTP.
    Returns True on success, False on failure.
    """
    if not settings.GMAIL_ADDRESS or not settings.GMAIL_APP_PASSWORD:
        logger.warning("Email not configured — set GMAIL_ADDRESS and GMAIL_APP_PASSWORD in .env")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"Logic Tech <{settings.GMAIL_ADDRESS}>"
        msg["To"] = to_email

        if text_body:
            msg.attach(MIMEText(text_body, "plain"))
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(settings.GMAIL_ADDRESS, settings.GMAIL_APP_PASSWORD)
            server.sendmail(settings.GMAIL_ADDRESS, to_email, msg.as_string())

        logger.info(f"Email sent to {to_email}: {subject}")
        return True

    except smtplib.SMTPAuthenticationError:
        logger.error("Gmail authentication failed — check GMAIL_ADDRESS and GMAIL_APP_PASSWORD")
        return False
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False


# ─── Email Templates ──────────────────────────────────────────────────────────

def _base_template(content: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f1a; color: #e2e8f0; }}
        .wrapper {{ max-width: 600px; margin: 0 auto; padding: 40px 20px; }}
        .card {{ background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                 border: 1px solid rgba(99,102,241,0.3); border-radius: 16px;
                 overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.5); }}
        .header {{ background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                   padding: 32px; text-align: center; }}
        .logo {{ font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }}
        .logo span {{ color: #fbbf24; }}
        .tagline {{ color: rgba(255,255,255,0.8); font-size: 13px; margin-top: 4px; }}
        .body {{ padding: 36px 32px; }}
        .greeting {{ font-size: 22px; font-weight: 700; color: #f1f5f9; margin-bottom: 16px; }}
        .text {{ color: #94a3b8; line-height: 1.7; font-size: 15px; margin-bottom: 16px; }}
        .btn {{ display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: #fff; text-decoration: none; border-radius: 10px; font-weight: 700;
                font-size: 15px; margin: 20px 0; letter-spacing: 0.3px; }}
        .divider {{ border: none; border-top: 1px solid rgba(99,102,241,0.2); margin: 24px 0; }}
        .badge {{ display: inline-block; padding: 4px 12px; border-radius: 20px;
                  font-size: 12px; font-weight: 600; margin: 2px; }}
        .badge-green {{ background: rgba(16,185,129,0.2); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }}
        .badge-blue {{ background: rgba(99,102,241,0.2); color: #818cf8; border: 1px solid rgba(99,102,241,0.3); }}
        .badge-yellow {{ background: rgba(251,191,36,0.2); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }}
        .info-box {{ background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
                     border-radius: 10px; padding: 16px 20px; margin: 16px 0; }}
        .footer {{ background: rgba(0,0,0,0.3); padding: 24px 32px; text-align: center; }}
        .footer p {{ color: #475569; font-size: 12px; line-height: 1.6; }}
        .footer a {{ color: #6366f1; text-decoration: none; }}
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="card">
          <div class="header">
            <div class="logo">Logic<span>Tech</span></div>
            <div class="tagline">IT Consultant Marketplace</div>
          </div>
          <div class="body">
            {content}
          </div>
          <div class="footer">
            <p>© 2025 Logic Tech. All rights reserved.</p>
            <p style="margin-top:8px;">
              You received this email because you have an account at Logic Tech.<br>
              <a href="#">Unsubscribe</a> · <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
    """


# ─── Public Email Functions ───────────────────────────────────────────────────

def send_welcome_email(to_email: str, name: str, role: str = "client") -> bool:
    """Send a welcome email to a newly registered user."""
    role_badge = {
        "admin": "badge-yellow",
        "consultant": "badge-blue",
        "client": "badge-green",
    }.get(role, "badge-green")

    content = f"""
        <div class="greeting">Welcome to Logic Tech, {name}! 🎉</div>
        <p class="text">
            Your account has been successfully created. You're now part of Kenya's
            premier IT consultant marketplace.
        </p>
        <div class="info-box">
            <p style="margin-bottom:8px;color:#94a3b8;font-size:13px;">YOUR ACCOUNT</p>
            <p style="color:#f1f5f9;font-weight:600;">{name}</p>
            <p style="color:#6366f1;font-size:13px;">{to_email}</p>
            <span class="badge {role_badge}" style="margin-top:8px;">{role.upper()}</span>
        </div>
        <p class="text">Here's what you can do on Logic Tech:</p>
        <ul style="color:#94a3b8;line-height:2;padding-left:20px;font-size:14px;">
            <li>Browse and hire top IT consultants</li>
            <li>Post and manage projects</li>
            <li>Message consultants in real-time</li>
            <li>Track project progress & payments</li>
        </ul>
        <div style="text-align:center;">
            <a href="http://localhost:5173/login" class="btn">Get Started →</a>
        </div>
        <hr class="divider">
        <p class="text" style="font-size:13px;">
            Need help? Reply to this email or visit our support centre.
        </p>
    """
    return _send_email(
        to_email=to_email,
        subject="Welcome to Logic Tech 🚀",
        html_body=_base_template(content),
        text_body=f"Welcome to Logic Tech, {name}! Visit http://localhost:5173 to get started.",
    )


def send_password_reset_email(to_email: str, name: str, reset_token: str) -> bool:
    """Send a password reset link email."""
    reset_url = f"http://localhost:5173/reset-password?token={reset_token}"
    content = f"""
        <div class="greeting">Reset Your Password 🔐</div>
        <p class="text">Hi {name},</p>
        <p class="text">
            We received a request to reset your Logic Tech password.
            Click the button below to choose a new password.
        </p>
        <div style="text-align:center;">
            <a href="{reset_url}" class="btn">Reset Password</a>
        </div>
        <div class="info-box">
            <p style="color:#fbbf24;font-size:13px;font-weight:600;">⚠ This link expires in 30 minutes</p>
            <p style="color:#94a3b8;font-size:13px;margin-top:4px;">
                If you can't click the button, copy this link:<br>
                <span style="color:#818cf8;word-break:break-all;">{reset_url}</span>
            </p>
        </div>
        <hr class="divider">
        <p class="text" style="font-size:13px;">
            If you didn't request a password reset, please ignore this email.
            Your password will remain unchanged.
        </p>
    """
    return _send_email(
        to_email=to_email,
        subject="Reset Your Logic Tech Password",
        html_body=_base_template(content),
        text_body=f"Reset your password at: {reset_url} (expires in 30 minutes)",
    )


def send_project_update_email(
    to_email: str,
    name: str,
    project_title: str,
    project_status: str,
    project_id: str,
) -> bool:
    """Send a project status update notification email."""
    status_colors = {
        "open": ("badge-blue", "📋 Open"),
        "assigned": ("badge-yellow", "👤 Assigned"),
        "in_progress": ("badge-yellow", "⚙ In Progress"),
        "completed": ("badge-green", "✅ Completed"),
        "cancelled": ("badge-yellow", "❌ Cancelled"),
    }
    badge_class, status_label = status_colors.get(project_status, ("badge-blue", project_status.title()))
    project_url = f"http://localhost:5173/projects/{project_id}"

    content = f"""
        <div class="greeting">Project Update 📊</div>
        <p class="text">Hi {name},</p>
        <p class="text">There's been an update to one of your projects on Logic Tech.</p>
        <div class="info-box">
            <p style="color:#94a3b8;font-size:12px;margin-bottom:6px;">PROJECT</p>
            <p style="color:#f1f5f9;font-weight:700;font-size:17px;">{project_title}</p>
            <p style="margin-top:8px;">
                Status: <span class="badge {badge_class}">{status_label}</span>
            </p>
        </div>
        <div style="text-align:center;">
            <a href="{project_url}" class="btn">View Project →</a>
        </div>
    """
    return _send_email(
        to_email=to_email,
        subject=f"Project Update: {project_title}",
        html_body=_base_template(content),
        text_body=f"Project '{project_title}' status: {project_status}. View at {project_url}",
    )


def send_new_message_email(
    to_email: str,
    recipient_name: str,
    sender_name: str,
    message_preview: str,
) -> bool:
    """Send a notification email about a new chat message."""
    preview = message_preview[:120] + "…" if len(message_preview) > 120 else message_preview
    content = f"""
        <div class="greeting">New Message 💬</div>
        <p class="text">Hi {recipient_name},</p>
        <p class="text">You have a new message from <strong style="color:#818cf8;">{sender_name}</strong> on Logic Tech.</p>
        <div class="info-box">
            <p style="color:#94a3b8;font-size:12px;margin-bottom:8px;">MESSAGE PREVIEW</p>
            <p style="color:#f1f5f9;font-style:italic;">"{preview}"</p>
        </div>
        <div style="text-align:center;">
            <a href="http://localhost:5173/messages" class="btn">Reply Now →</a>
        </div>
        <hr class="divider">
        <p class="text" style="font-size:13px;">
            Log in to Logic Tech to read and reply to your message.
        </p>
    """
    return _send_email(
        to_email=to_email,
        subject=f"New message from {sender_name} on Logic Tech",
        html_body=_base_template(content),
        text_body=f"{sender_name} sent you a message: \"{preview}\". Reply at http://localhost:5173/messages",
    )
