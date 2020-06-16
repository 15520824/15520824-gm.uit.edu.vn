<?php
$created = "2020-06-09 06:24:54";
$created = date_create_from_format('Y-m-d H:i:s', $created); 
echo $created->getTimestamp();