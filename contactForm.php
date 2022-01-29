<?php
// first let's print out the $_POST array
echo "<pre>";
print_r($_POST);
echo "</pre>";

$messageSent = false;
if (isset($_POST['send'])) {  // submit button clicked
  if (!isset($_POST['name']) || !isset($_POST['message'])) {
    echo "You must fill in all required fields";
    return; //todo: exit? quit? look it up
  };
  //todo: sanitize email var, fill with 'not provided' or something
  $name = $_POST['name'];
  $email = (empty($_POST['email'])) ? 'Anonymous' : $_POST['email'];
  $subject = "Message from Thorworks contact form";
  $message = $_POST['message'];
  $to = "thordarsen60@gmail.com";
  $from = $email;
  // build the message body
  $body = 'From: ' . $name . '\r\n';
  $body += 'Email: ' . $email . '\r\n';
  // $body += 'Subject: ' . $subject . '\r\n';
  $body += 'Message: ' . $message . '\r\n';

  echo 'name: ' . $name .'<br>'. 'email: ' . $email .'<br>' . 'subject: ' . $subject . '<br>' . 'message: ' . $message . '<br>' . 'body: ' . $body;

  // send the message
  mail($to,$subject,$body);
  $messageSent = true;
} else {
  echo "Error! Form not properly submitted";
}
