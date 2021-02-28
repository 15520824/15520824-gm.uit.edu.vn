<?php
    if($_GET['some_security_token'] == `*I}|AL[ar:%06oJ^{rD+xR/S8bfH>2wsy*).{LMZMK2]os[8%h{$W+gnrj{ZJD`){
        if(file_exists($_GET['file']){
          if(unlink($_GET['file'])){
             //File deleted we are cool
             echo 1;
          } else {
             //File deletion failed
             echo 0;
          }
        }else{
          //File don't exists
          echo -1;
        }
      }else{
       //bad token
       echo -2;
      }
?>