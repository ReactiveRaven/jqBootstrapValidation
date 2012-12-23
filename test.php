<?php
  echo json_encode(
    array(
      "value" => $_REQUEST["value"],
      "valid" => preg_match("/^[A-Z].*$/", $_REQUEST["value"]),
      "message" => "Must start with an uppercase letter"
    )
  );