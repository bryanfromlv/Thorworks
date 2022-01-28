<?php
if (isset($_POST['send'])) {
  // submit button clicked
  if (!isset($_POST['name']) || !isset($_POST['message'])) {
    //! error! exit here and report error
  };
  $name = $_POST['name'];
  $email = $_POST['email'];
  $message = $_POST['message'];
  $subject = "Message from Thorworks contact form";
}
