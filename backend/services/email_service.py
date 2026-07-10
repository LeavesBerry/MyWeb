import smtplib
from email.message import EmailMessage

from config import EMAIL_SENDER, EMAIL_AUTH_CODE


def send_email(
    user_email: str,
    subject: str,
    text_content: str,
    html_content: str | None = None,
) -> tuple[bool, Exception | None]:
    try:
        with smtplib.SMTP_SSL("smtp.qq.com", 465) as sender:
            sender.login(EMAIL_SENDER, EMAIL_AUTH_CODE)
            msg = EmailMessage()
            msg.set_content(text_content, subtype="plain", charset="utf-8")
            if html_content:
                msg.add_alternative(html_content, subtype="html", charset="utf-8")
            msg["From"] = f"LeavesBerry <{EMAIL_SENDER}>"
            msg["To"] = user_email
            msg["Subject"] = subject
            sender.send_message(msg)
        return True, None
    except Exception as e:
        return False, e
