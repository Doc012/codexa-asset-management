package backend.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    @Value("${app.base-url}")
    private String baseUrl;

    //_______// Email Verification \\_______
    @Async
    public void sendVerificationEmail(String toEmail, String firstName, String token){
        String verifyUrl = baseUrl + "/api/v1/auth/verify-email?token=" + token;

        String html = """
                <html>
                    <body style="font-family: Arial, sans-serif; color: #333; padding: 24px;">
                        <h2>Verify your email address</h2>
                        <p>Hi %s</p>
                        <p>
                            Thanks for registering. Click the button below to verify your email address.
                            This link expires in <strong>24 hours</strong>.
                        </p>
                        <a href="%s" style="display:inline-block;padding:12px 24px;background:#4F46E5;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0;">
                            Verify Email
                        </a>
                        <p style="color:#888;font-size:12px;">
                            If you didn't create an account, you can safely ignore this email.
                        </p>
                    </body>
                </html>
                """.formatted(firstName, verifyUrl);

        sendHtmlEmail(toEmail, "Verify your email address", html);
        log.info("Verification email sent to {}", toEmail);
    }

    //_______// Password Reset \\_______
    @Async
    public void sendPasswordResetEmail(String toEmail, String firstName, String token){
        String resetUrl = "http://127.0.0.1:5500/pages/auth/reset-password.html?token=" + token;

        String html = """
                <html>
                    <body style="font-family: Arial, sans-serif; color: #333; padding: 24px;">
                        <h2>Reset your password</h2>
                        <p>Hi %s</p>
                        <p>
                            We received a request to reset your password. Click the button below.
                            This link expires in <strong>15 minutes</strong>.
                        </p>
                        <a href="%s" style="display:inline-block;padding:12px 24px;background:#DC2626;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0;">
                            Reset Password
                        </a>
                        <p style="color:#888;font-size:12px;">
                            If you didn't request this, you can safely ignore this email.
                            Your password will not change.
                        </p>
                    </body>
                </html>
                """.formatted(firstName, resetUrl);

        sendHtmlEmail(toEmail, "Reset your password", html);
        log.info("Password reset email sent to {}", toEmail);
    }

    //_______// Approved Loan Request \\_______
    @Async
    public void sendApprovedLoanEmail(String toEmail, String firstName, String assetTitle){
        String html = """
            <html>
                <body style="font-family: Arial, sans-serif; color: #333; padding: 24px;">
                    <h2>Your loan request was approved</h2>
                    <p>Hi %s</p>
                    <p>
                        Your request for <strong>%s</strong> has been approved.
                        You can collect it from the department's asset custodian.
                    </p>
                    <p style="color:#888;font-size:12px;">
                        If you weren't expecting this, please contact your asset administrator.
                    </p>
                </body>
            </html>
            """.formatted(firstName, assetTitle);

        sendHtmlEmail(toEmail, "Loan Request Approved", html);
        log.info("Loan approval email sent to {}", toEmail);
    }

    //_______// Internal Helpers \\_______
    private void sendHtmlEmail(String to, String subject, String htmlBody){
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MessagingException e){
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Email send failed", e);
        }
    }
}
