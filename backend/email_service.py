from flask import current_app
from flask_mail import Message

from extensions import mail


def send_contact_notification(contact_message):
    try:
        recipient = current_app.config["MAIL_USERNAME"]

        msg = Message(
            subject=f"New Contact Message - {contact_message.subject or 'No Subject'}",
            sender=recipient,
            recipients=[recipient],
            reply_to=contact_message.email
        )

        msg.body = f"""
You have received a new contact message from the Horizon website.

Name: {contact_message.name}
Email: {contact_message.email}
Phone: {contact_message.phone or 'Not provided'}
Subject: {contact_message.subject or 'No subject'}

Message:
{contact_message.message}

Received:
{contact_message.created_at}

----------------------------------------
Horizon Software Company Ltd
Technology Within Reach
"""

        mail.send(msg)

        print("Contact email notification sent successfully.")
        return True

    except Exception as error:
        print(f"Email notification failed: {error}")
        return False


def send_quote_notification(quote_request):
    try:
        recipient = current_app.config["MAIL_USERNAME"]

        msg = Message(
            subject=f"New Quote Request - {quote_request.service or 'General Inquiry'}",
            sender=recipient,
            recipients=[recipient],
            reply_to=quote_request.email
        )

        msg.body = f"""
You have received a new quote request from the Horizon website.

Name: {quote_request.name}
Email: {quote_request.email}
Phone: {quote_request.phone or 'Not provided'}

Service:
{quote_request.service or 'Not specified'}

Project Description:
{quote_request.project_description or 'Not provided'}

Budget:
{quote_request.budget or 'Not provided'}

Received:
{quote_request.created_at}

----------------------------------------
Horizon Software Company Ltd
Technology Within Reach
"""

        mail.send(msg)

        print("Quote email notification sent successfully.")
        return True

    except Exception as error:
        print(f"Quote email notification failed: {error}")
        return False