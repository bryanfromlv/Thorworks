<?php
// first let's print out the $_POST array
// echo "<pre>";
// print_r($_POST);
// echo "</pre>";

$messageSent = false;
if (isset($_POST['send'])) {  // submit button clicked
  if (!isset($_POST['name']) || !isset($_POST['message'])) {
    echo "You must fill in all required fields<br>";
    exit; //todo: die?
  };
  $name = $_POST['name'];
  $email = (empty($_POST['email'])) ? 'Anonymous' : $_POST['email'];
  $subject = "Message from Thorworks contact form";
  $message = $_POST['message'];
  $to = "thordarsen60@gmail.com";
  // build the message body
  $body = 'From: ' .$name. '\r\n';
  $body .= 'Email: ' .$email. '\r\n';
  $body .= 'Message: ' .$message. '\r\n';
  // build the header
  $headers = array(
    'From' => 'thordarsen.net',
    'Reply-To' => 'thordarsen.net',
    'X-Mailer' => 'PHP/' . phpversion()
  );

  // echo '<br>name: ' .$name. '<br>email: ' .$email. '<br>subject: ' .$subject. '<br>message: ' .$message. '<br>body: ' .$body. '<br>headers: ' . print_r($headers). '<br>';

  // send the message
  // echo 'sending message<br>';
  mail($to,$subject,$body,$headers);
  $messageSent = true;
} else {
  echo "Error! Form not properly submitted<br>";
}
// echo 'messageSent= ' .$messageSent. '<br>';
//todo: redirect to main page
header("location: https://thordarsen.net?messageSent=" . $messageSent);
