<?php

  $value = $_REQUEST["value"];
  
  $valid = preg_match("/^[A-Z].*$/", $value);
  
  $message = $valid ? "OK" : "Must start with an uppercase letter";
  
  echo json_encode(
    array(
      "value" => $value,
      "valid" => $valid,
      "message" => $message
    )
  );