using System.Threading;
using Starter.Core.Models.Email;

namespace Starter.Core.Interfaces.Services;

public interface IEmailService
{
    Task<bool> SendAsync(EmailData emailData, CancellationToken cancellationToken);
}