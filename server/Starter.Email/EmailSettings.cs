﻿namespace Starter.Email;

public class EmailSettings
{
    public string From { get; set; }
    public string SmtpServer { get; set; }
    public bool Ssl { get; set; }
    public int Port { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }
}