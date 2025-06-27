from flask import Flask, request, jsonify
import os
import smtplib
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email import encoders
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configure email credentials and recipient
EMAIL = "sriharik997@gmail.com"
APP_PASSWORD = "jyxt xbks odor gbyl"  # Use an App Password, not your main password
RECIPIENT = "kaviyasri5054@gmail.com"

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/send-pdf', methods=['POST'])
def send_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.endswith('.pdf'):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # Construct Email
        msg = MIMEMultipart()
        msg['From'] = EMAIL
        msg['To'] = RECIPIENT
        msg['Subject'] = "PDF Attachment"

        body = "Hello,\n\nPlease find the attached PDF file.\n\nRegards"
        msg.attach(MIMEText(body, 'plain'))

        # Attach PDF
        with open(filepath, "rb") as attachment:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header(
                "Content-Disposition",
                f"attachment; filename={filename}",
            )
            msg.attach(part)

        # Send email
        try:
            with smtplib.SMTP("smtp.gmail.com", 587) as server:
                server.starttls()
                server.login(EMAIL, APP_PASSWORD)
                server.sendmail(EMAIL, RECIPIENT, msg.as_string())
                return jsonify({"message": "Mail sent successfully"})
        except smtplib.SMTPAuthenticationError as e:
            return jsonify({"error": "Authentication error", "details": str(e)}), 401
        except Exception as e:
            return jsonify({"error": "Failed to send email", "details": str(e)}), 500
    else:
        return jsonify({"error": "Only PDF files are allowed"}), 400

if __name__ == '__main__':
    app.run(debug=True)
