namespace Starter.Email;

public interface IEmailSender
{
    void SendEmail(EmailMessage emailMessage);
    Task SendEmailAsync(EmailMessage emailMessage);
}