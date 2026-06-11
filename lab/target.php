<?php
header('Content-Type: text/plain');

if (array_key_exists('sleep', $_REQUEST)) {
	sleep((int) $_REQUEST["sleep"]);
}
echo "\nFILES: ";
print_r($_FILES);
echo "\nREQUEST: ";
print_r($_REQUEST);
?>
