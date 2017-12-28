<?php
$secret="6LezFjAUAAAAAD_RpMQbXIpMpYY32u9Jqqv1AWjB";
$response=$_POST["captcha"];

$verify=file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secret}&response={$response}");
$captcha_success=json_decode($verify);
$responseObj->verified = false;

if ($captcha_success->success==true) {
  // This user is verified by recaptcha
  $responseObj->verified = true;
}

$jsonResponse = json_encode($responseObj);
echo $jsonResponse;
