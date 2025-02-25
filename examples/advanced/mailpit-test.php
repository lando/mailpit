#!/usr/bin/env php
<?php
/**
 * Send a test email using PHP's mail function.
 *
 * This script demonstrates how to send an email using the Lando Mailpit service.
 * It includes checks for the availability of the mail function, sendmail binary,
 * and provides detailed information about the mail configuration.
 */

// Function to safely get PHP configuration values
function safe_ini_get($setting) {
    return @ini_get($setting) ?: 'Not available';
}

// Function to safely get loaded extensions
function safe_get_loaded_extensions() {
    return function_exists('get_loaded_extensions') ? implode(', ', get_loaded_extensions()) : 'Unable to retrieve loaded extensions';
}

// Check if mail function exists
if (!function_exists('mail')) {
    echo "Error: The mail() function is not available in this PHP installation.\n";
    echo "Please ensure that the PHP mail extension is installed and enabled.\n";
    exit(1);
}

// Check for sendmail binary
$sendmail_path = safe_ini_get('sendmail_path');
if (empty($sendmail_path)) {
    echo "Warning: sendmail_path is not set in PHP configuration.\n";
} else {
    $sendmail_binary = explode(' ', $sendmail_path)[0];
    if (!file_exists($sendmail_binary)) {
        echo "Error: Sendmail binary not found at $sendmail_binary\n";
        echo "Please ensure that sendmail is installed and the path is correct in PHP configuration.\n";
        exit(1);
    } else {
        echo "Sendmail binary found at $sendmail_binary\n";
    }
}

// Check if we can connect to the mail server
$smtp_server = safe_ini_get('SMTP');
$smtp_port = safe_ini_get('smtp_port');
echo "\nAttempting to connect to SMTP server ($smtp_server:$smtp_port):\n";
$socket = @fsockopen($smtp_server, $smtp_port, $errno, $errstr, 5);
if ($socket) {
    echo "Successfully connected to the SMTP server.\n";
    fclose($socket);
} else {
    echo "Failed to connect to the SMTP server. Error: $errstr ($errno)\n";
    exit(1);
}

// Email configuration
$to = 'recipient@example.com';
$subject = 'Test email from Lando Mailpit';
$message = 'This is a test email sent from the Lando Mailpit example.';
$additional_headers = [
    'From: sender@example.com',
    'Reply-To: sender@example.com',
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=utf-8'
];

// Output email details
echo "Attempting to send test email with the following details:\n";
echo "To: $to\n";
echo "Subject: $subject\n";
echo "Message: $message\n";
echo "Additional Headers:\n";
foreach ($additional_headers as $header) {
    echo "  $header\n";
}
echo "\n";

// Attempt to send the email
$result = @mail($to, $subject, $message, implode("\r\n", $additional_headers));

if ($result) {
    echo "PHP reports that the email was accepted for delivery.\n";
    echo "Note: This does not guarantee the email was actually sent or received.\n";
    echo "Please check the Mailpit interface to see if the email was received there.\n";
} else {
    echo "Error: PHP reports that the email was not accepted for delivery.\n";
    $error = error_get_last();
    echo "Error message: " . ($error['message'] ?? 'Unknown error') . "\n";
    error_log("Failed to send email: " . ($error['message'] ?? 'Unknown error'));
    exit(1);
}

// Output mail configuration for debugging
echo "\nEnvironment variables:\n";
echo "MAIL_HOST: " . (getenv('MAIL_HOST') ?: 'Not set') . "\n";
echo "MAIL_PORT: " . (getenv('MAIL_PORT') ?: 'Not set') . "\n";

// Output PHP mail configuration
echo "\nPHP mail configuration:\n";
echo "SMTP: " . safe_ini_get('SMTP') . "\n";
echo "smtp_port: " . safe_ini_get('smtp_port') . "\n";
echo "sendmail_path: " . safe_ini_get('sendmail_path') . "\n";

// Additional system information
echo "\nAdditional Information:\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Loaded PHP Extensions: " . safe_get_loaded_extensions() . "\n";
