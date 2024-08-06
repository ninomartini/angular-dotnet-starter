using System.Threading;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Starter.Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }
        
        public async Task<bool> SendAsync(EmailData emailData, CancellationToken cancellationToken = default)
        {
            try
            {
                // Initialize a new instance of the MimeKit.MimeMessage class
                var mail = new MimeMessage();

               // Sender
                mail.From.Add(new MailboxAddress(_emailSettings.DisplayName, emailData.From ?? _emailSettings.From));
                mail.Sender = new MailboxAddress(emailData.DisplayName ?? _emailSettings.DisplayName, emailData.From ?? _emailSettings.From);

                // Receiver
                foreach (string mailAddress in emailData.To)
                    mail.To.Add(MailboxAddress.Parse(mailAddress));

                // Set Reply to if specified in mail data
                if(!string.IsNullOrEmpty(emailData.ReplyTo))
                    mail.ReplyTo.Add(new MailboxAddress(emailData.ReplyToName, emailData.ReplyTo));

                // BCC
                // Check if a BCC was supplied in the request
                if (emailData.Bcc != null)
                {
                    // Get only addresses where value is not null or with whitespace. x = value of address
                    foreach (string mailAddress in emailData.Bcc.Where(x => !string.IsNullOrWhiteSpace(x)))
                        mail.Bcc.Add(MailboxAddress.Parse(mailAddress.Trim()));
                }

                // CC
                // Check if a CC address was supplied in the request
                if (emailData.Cc != null)
                {
                    foreach (string mailAddress in emailData.Cc.Where(x => !string.IsNullOrWhiteSpace(x)))
                        mail.Cc.Add(MailboxAddress.Parse(mailAddress.Trim()));
                }

                // Add Content to Mime Message
                var body = new BodyBuilder();
                mail.Subject = emailData.Subject;
                body.HtmlBody = emailData.Body;
                mail.Body = body.ToMessageBody();

                // Send Email
                using var smtp = new SmtpClient();

                if (_emailSettings.UseSsl)
                {
                    await smtp.ConnectAsync(_emailSettings.Host, _emailSettings.Port, SecureSocketOptions.SslOnConnect, cancellationToken);
                }
                else if (_emailSettings.UseStartTls)
                {
                    await smtp.ConnectAsync(_emailSettings.Host, _emailSettings.Port, SecureSocketOptions.StartTls, cancellationToken);
                }
                await smtp.AuthenticateAsync(_emailSettings.UserName, _emailSettings.Password, cancellationToken);
                await smtp.SendAsync(mail, cancellationToken);
                await smtp.DisconnectAsync(true, cancellationToken);
                
                return true;

            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}