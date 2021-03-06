<?php

    if($user!=null) { // already logged in
        include"view_2.php";
        goto skip_this_page;
    }

    // Handling query

    if(isset($_POST["username"]) && isset($_POST["password"])){

        $login_resp=user::login($_POST["username"], $_POST["password"], gf::getClientIP()); // checking login parameters

        if ($login_resp instanceof user){ // login parameters are valid
            $login_resp->reset_password_token = NULL;
            $_SESSION["user"]=serialize($login_resp); // storing user to session
            $_SESSION["pwd"]=$_POST["password"];
						if($login_resp->count_pages==1) $url = url_root."/".$login_resp->pages[0]->url;
						else $url = url_root."/account";

            die(json_encode(array(
                "status" => "logged_in",
                "params" => array(
                    "displayname" => $login_resp->displayname,
										"goto_page" => $url
                )
            )));
        }elseif (is_array($login_resp)) {
            if($login_resp["status"] == "waiting_restriction_time"){
                die(json_encode(array(
                    "status" => "waiting_restriction_time",
                    "params" => array(
                        "remaining_time" => $login_resp["remaining_time"]
                    )
                )));
            }elseif($login_resp["status"] == "password_error"){
                die(json_encode(array(
                    "status" => "password_error",
                    "params" => array(
                        "remaining_attempts" => $login_resp["remaining_attempts"]
                    )
                )));
            }
            elseif($login_resp["status"] == "username_error") die(json_encode(array("status"=>"username_error")));
            elseif($login_resp["status"] == "restricted_host") die(json_encode(array("status"=>"restricted_host")));
            else die(json_encode(array("status"=>"unhandled_error")));
        }else die($login_resp); // username_error
    }

    // definig page SEO parameters
	// ...


	// select and display right view

	include "view_1.php";

    skip_this_page: // jump to end for already logged in
?>
