import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# Configuration (Mock by default, can use Gmail if env vars set)
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "apikey") # or your email
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "") # app password

def send_email(to_email: str, subject: str, body: str):
    """
    Sends an email. If credentials aren't set, it just logs to console.
    """
    if not SMTP_PASSWORD or not to_email or "@" not in to_email:
        print(f"Bypassing Email Send (Mock Mode).")
        print(f"To: {to_email}\nSubject: {subject}\nBody:\n{body}\n")
        return True

    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_USER
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(SMTP_USER, to_email, text)
        server.quit()
        print(f"Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

def format_prescription_email(patient_name, drug_name, dosage, frequency, times, duration="Unlimited", reason="Not specified"):
    return f"""
Hello {patient_name},

Your doctor has prescribed a new medication for you:

Drug: {drug_name}
Dosage: {dosage}
Frequency: {frequency}
Duration: {duration}
Reason: {reason}
Schedule: {', '.join(times)}

Please log in to your MedCare portal to view your full schedule and track your adherence.

Stay Healthy,
MedCare Team
"""
