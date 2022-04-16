<?php
// first let's print out the $_POST array
// echo "<pre>";
// print_r($_POST);
// echo "</pre>";

$messageSent = false;
// check honeypot first
$honeypot = filter_input(INPUT_POST, 'world', FILTER_SANITIZE_SPECIAL_CHARS);
if ($honeypot) {
  header($_SERVER['SERVER_PROTOCOL'] . ' 405 Method Not Allowed');
  die();
}

// validate name
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS);
$inputs['name'] = $name;
if (!$name || trim($name) === '') {
    $errors['name'] = 'Please enter your name';
}

// validate email
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$inputs['email'] = $email;
if ($email) {
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    if (!$email) {
        $errors['email'] = 'Please enter a valid email';
    }
} else {
    $errors['email'] = 'Please enter an email';
}

// validate subject
$subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_SPECIAL_CHARS);
$inputs['subject'] = $subject;
if (!$subject || trim($subject) === '') {
    $errors['subject'] = 'Please enter the subject';
}

// validate message
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_SPECIAL_CHARS);
$inputs['message'] = $message;
if (!$message || trim($message) === '') {
    $errors['message'] = 'Please enter the message';
}
if (isset($_POST['send'])) {  // submit button clicked
  if (!isset($_POST['name']) || !isset($_POST['message'])) {
    die("You must fill in all required fields<br>");
  };
  $name = $_POST['name'];
  $email = (empty($_POST['email'])) ? 'Anonymous' : $_POST['email'];
  $subject = "Message from Thorworks contact form";
  $message = $_POST['message'];
  $to = "thordarsen60@gmail.com";
  // build the message body (\n doesn't work, use html)
  $body = "From: " .$name. "<br>";
  $body .= "Email: " .$email. "<br>";
  $body .= "Message: " .$message. "<br>";
  // build the header (requires \r\n)
  $header = "From: thordarsen.net \r\n";
  $header .= "MIME-Version: 1.0\r\n";
  $header .= "Content-type: text/html\r\n";
  $header .= "X-Mailer: PHP/" .phpversion(). "\r\n";
  // send the message
  $messageSent = mail($to,$subject,$body,$header);
} else {
  die("Error! Form not properly submitted<br>");
}
// redirect to main page with messageSent parameter
// note that we don't need to concat strings when using double-quotes
//! this will not work if any output comes before it, including blank lines
header("Location: https://thordarsen.net/index.html?messageSent=$messageSent");
exit;