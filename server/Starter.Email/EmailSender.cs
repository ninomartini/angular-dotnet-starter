using System.IO;
using System.Linq;
using MailKit.Net.Smtp;

namespace Starter.Email;

public class EmailSender : IEmailSender
{
    private readonly IOptions<EmailSettings> _emailSettings;

    public EmailSender(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings;
    }

    public void SendEmail(EmailMessage emailMessage)
    {
        var messageToSend = CreateEmailMessage(emailMessage);

        Send(messageToSend);
    }

    public async Task SendEmailAsync(EmailMessage emailMessage)
    {
        var messageToSend = CreateEmailMessage(emailMessage);

        await SendAsync(messageToSend);
    }

    private MimeMessage CreateEmailMessage(EmailMessage emailMessage)
    {
        var messageToSend = new MimeMessage();
        messageToSend.From.Add(new MailboxAddress(_emailSettings.Value.From));
        messageToSend.To.AddRange(emailMessage.To);
        messageToSend.Subject = emailMessage.Subject;

        var bodyBuilder = new BodyBuilder {HtmlBody = emailMessage.Content};

        if (emailMessage.Attachments != null && emailMessage.Attachments.Any())
            foreach (var attachment in emailMessage.Attachments)
            {
                byte[] fileBytes;
                using (var ms = new MemoryStream())
                {
                    attachment.CopyTo(ms);
                    fileBytes = ms.ToArray();
                }

                bodyBuilder.Attachments.Add(attachment.FileName, fileBytes, ContentType.Parse(attachment.ContentType));
            }

        messageToSend.Body = bodyBuilder.ToMessageBody();
        return messageToSend;
    }

    private void Send(MimeMessage mimeMessage)
    {
        using (var client = new SmtpClient())
        {
            try
            {
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                client.SslProtocols = System.Security.Authentication.SslProtocols.Tls13 | System.Security.Authentication.SslProtocols.Tls12;
                client.Connect(_emailSettings.Value.SmtpServer, _emailSettings.Value.Port, MailKit.Security.SecureSocketOptions.SslOnConnect);
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                client.Authenticate(_emailSettings.Value.UserName, _emailSettings.Value.Password);

                client.Send(mimeMessage);
            }
            catch
            {
                //log an error message or throw an exception or both.
                throw;
            }
            finally
            {
                client.Disconnect(true);
                client.Dispose();
            }
        }
    }

    private async Task SendAsync(MimeMessage mailMessage)
    {
        using (var client = new SmtpClient())
        {
            try
            {
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                await client.ConnectAsync(_emailSettings.Value.SmtpServer, _emailSettings.Value.Port, _emailSettings.Value.Ssl);
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                await client.AuthenticateAsync(_emailSettings.Value.UserName, _emailSettings.Value.Password);

                await client.SendAsync(mailMessage);
            }
            catch
            {
                //log an error message or throw an exception, or both.
                throw;
            }
            finally
            {
                await client.DisconnectAsync(true);
                client.Dispose();
            }
        }
    }
}