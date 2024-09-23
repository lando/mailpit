<?php
$to = 'recipient@example.com';
$subject = 'Test email from Lando Mailpit';
$message = 'This is a test email sent from the Lando Mailpit example.';
$headers = 'From: sender@example.com' . "\r\n" .
    'Reply-To: sender@example.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

mail($to, $subject, $message, $headers);
echo "Test email sent to $to";
