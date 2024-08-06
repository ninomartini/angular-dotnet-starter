﻿using System.Collections.Generic;
using System.Linq;

namespace Starter.Email;

public class EmailMessage
{
    public EmailMessage(IEnumerable<string> to, string subject, string content, IFormFileCollection attachments)
    {
        To = new List<MailboxAddress>();

        To.AddRange(to.Select(x => new MailboxAddress(x)));
        Subject = subject;
        Content = content;
        Attachments = attachments;
    }

    public List<MailboxAddress> To { get; set; }
    public string Subject { get; set; }
    public string Content { get; set; }

    public IFormFileCollection Attachments { get; set; }
}