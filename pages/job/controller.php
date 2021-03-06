<?php
	if (!isset($_GET['id'])) {include __DIR__."/../404/controller.php";goto skip_this_page;}
	else{
		$job=new job($_GET['id']);
		if (!$job->isvalid) {include __DIR__."/../404/controller.php";goto skip_this_page;}
	}

	$is_admin_level = ($user!=null && !$user->is_master && $page->admin==$user);

	if(isset($_POST["cancel_password_reset_ticket"])){
		$admin = $job->admin;
		$admin->reset_password_token = NULL;
		die(json_encode(array("status"=>"success")));
	} elseif (isset($_POST["new_password_reset_ticket"])) {
		$admin = $job->admin;
		$token = $admin->set_reset_password_token();
		die(json_encode(array("status"=>"success", "params"=>array(
			"token"=>$token
		))));
	}

	if(isset($_POST["email"]) && isset($_POST["subject"]) && isset($_POST["message"])){

		chdir(__DIR__);
		include_once '../../core/PHPMailer/PHPMailerAutoload.php';

		$mail = new PHPMailer;

		$mail->isSMTP();
		$mail->Host = 'servicek.net';
		$mail->SMTPAuth = true;
		$mail->Username = "no-reply@servicek.net";
		$mail->Password = $smtp_noreply_password;
		$mail->SMTPSecure = 'tls';
		$mail->Port = 587;
		$mail->SMTPOptions = array(
		    'ssl' => array(
		        'verify_peer' => false,
		        'verify_peer_name' => false,
		        'allow_self_signed' => true
		    )
		);

		$mail->From = "no-reply@servicek.net";
		$mail->FromName = "servicek.net";
		$mail->addAddress($job->url."@servicek.net");

		$mail->addReplyTo($_POST["email"]);

		if(isset($_FILES["attachments"])){
			for ($i=0; $i < count($_FILES["attachments"]["name"]); $i++) {
				$mail->addAttachment($_FILES["attachments"]["tmp_name"][$i], $_FILES["attachments"]["name"][$i]);
			}
		}

		$mail->isHTML(true);

		$mail->Subject = $_POST["subject"];
		$mail->Body    = $_POST["message"];
		$mail->AltBody = strip_tags(str_replace(array("</p>"), "\r\n", str_replace(array("<br>", "</br>", "<br/>"), "\r\n", $_POST["message"])));

		if(!$mail->send()) die($mail->ErrorInfo);
		else {
			die(json_encode(array("status"=>"success")));
		}
	}

	$geolocation=json_decode($job->geolocation);
	$is_contracted = $job->is_contracted;
	if($is_contracted) $is_trial = ($job->current_contract->type == 0);
	$categories = array();
	$categories_json = array();
	$nb_categories = 0;
	$categories_obj = $job->categories;
	foreach ($categories_obj as $c){
		$categories_json[] = intval($c->id);
		$categories[] = $c->name;
		$nb_categories+=1;
	}

	$categories = implode(", ", $categories);

	if ($job->admin==$user || ($user && $user->is_master)) {
		if (!isset($_POST['element']) && isset($_POST['pk']) && isset($_POST['name']) && isset($_POST['value'])) {
			switch ($_POST['name']) {
				case 'description':
					$job->description=$_POST['value'];
					break;
				case 'name':
					$job->name=$_POST['value'];
					break;
				case 'address':
					$job->address=$_POST['value'];
					break;
				case 'tel':
					$job->tel=$_POST['value'];
					break;
				case 'mobile':
					$job->mobile=$_POST['value'];
					break;
				case 'email':
					$job->email=$_POST['value'];
					break;
				case 'categories' :
					if(count($_POST['value'])==0){
						header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
						echo "Domaine d'activité requit";
						die();
					}
					$job->unassign_from_all_categories();
					foreach ($_POST['value'] as $value) {
						$job->assign_to_category(new category(intval($value)));
					}
				break;
				default:
					header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
					break;
			}
			die();
		}elseif (isset($_POST['element']) && isset($_POST['pk']) && isset($_POST['name']) && isset($_POST['value'])) {
			switch ($_POST['element']) {
				case 'skill':
					$s=new job_skill($_POST['pk']);
					switch ($_POST['name']) {
						case 'title': $s->title = $_POST['value']; break;
						case 'description': $s->description = $_POST['value']; break;
						case 'percent': $s->percent = $_POST['value']; break;
					}
					break;
				case 'portfolio':
					$portfolio = new portfolio($_POST['pk']);
					switch ($_POST['name']) {
						case 'name': $portfolio->name=$_POST['value']; break;
						case 'description': $portfolio->description=$_POST['value']; break;
						case 'categories' :
							$portfolio->unassign_from_all_categories();
							foreach ($_POST['value'] as $value) {
								$portfolio->assign_to_category(new category(intval($value)));
							}
						break;
					}
					break;
				case 'cv':
					$c=new job_cv($_POST['pk']);
					switch ($_POST['name']) {
						case 'title': $c->title = $_POST['value']; break;
						case 'description': $c->description = $_POST['value']; break;
					}
				break;
				case 'cv_item':
					$i=new job_cv_item($_POST['pk']);
					switch ($_POST['name']) {
						case 'title': $i->title = $_POST['value']; break;
						case 'description': $i->description = $_POST['value']; break;
						case 'at': $i->at = $_POST['value']; break;
						case 'date_from':
							$to = $i->date_to;
							if($to && $_POST['value'] && strtotime($to) < strtotime($_POST['value'])){
								header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
								die("Cette date ne peut pas être supérieure à la date fin");
							}
							$i->date_from = $_POST['value'];
						break;
						case 'date_to':
							$from = $i->date_from;
							if($from && $_POST['value'] && strtotime($from) > strtotime($_POST['value'])){
								header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
								die("Cette date ne peut pas être inférieure à la date début");
							}
							$i->date_to = $_POST['value'];
						break;
						case 'location': $i->location = $_POST['value']; break;
					}
				break;
				case 'cv_item_project':
					$p=new job_cv_item_project($_POST['pk']);
					switch ($_POST['name']) {
						case 'title': $p->title = $_POST['value']; break;
						case 'description': $p->description = $_POST['value']; break;
					}
				break;
			}
			die();
		}elseif(isset($_POST["geolocation"]) && isset($_POST["latitude"]) && isset($_POST["longitude"])){
			$job->geolocation = json_encode(array("longitude"=>$_POST["longitude"], "latitude"=>$_POST["latitude"]));
			die("success");

		}elseif (isset($_POST['new_portfolio'])) {

			$portfolio=portfolio::create($job);
			die(json_encode(array("status"=>"success", "id"=>$portfolio->id, "url"=>url_root."/".$portfolio->url)));

		}elseif (isset($_POST['delete_portfolio'])) {

			$portfolio=new portfolio($_POST['delete_portfolio']);
			$portfolio->delete();

			die(json_encode(array("status"=>"success")));

		}elseif(isset($_POST["file"]) && $_POST["file"]=="image"){

			$oldname=$paths->job_image->dir.$job->image;

			if(file_exists($oldname) && is_file($oldname)) unlink($oldname);

			$name=gf::generate_guid().".".end((explode(".", $_FILES["image"]["name"])));
			move_uploaded_file($_FILES["image"]["tmp_name"], $paths->job_image->dir.$name);

			$job->image=$name;

			die("success");
		}elseif(isset($_POST["file"]) && $_POST["file"]=="portfolio_image" && isset($_POST["pk"])){

			$portfolio=new portfolio($_POST["pk"]);

			$oldname=$paths->portfolio_image->dir.$portfolio->image;

			if(file_exists($oldname) && is_file($oldname)) unlink($oldname);

			$name=gf::generate_guid().".".end((explode(".", $_FILES["image"]["name"])));
			move_uploaded_file($_FILES["image"]["tmp_name"], $paths->portfolio_image->dir.$name);

			$portfolio->image=$name;

			die("success");
		}elseif(isset($_POST["add"])){
			switch ($_POST["add"]) {
				case 'skill':
					$s=job_skill::create($job);
					die(json_encode(array('status' => 'success', 'id' => $s->id)));
				break;
				case 'cv':
					$c=job_cv::create($job);
					die(json_encode(array('status' => 'success', 'id' => $c->id)));
				break;
				case 'cv_item':
					$c=new job_cv($_POST["cv"]);
					$i=job_cv_item::create($c);
					die(json_encode(array('status' => 'success', 'id' => $i->id)));
				break;
				case 'cv_item_project':
					$i=new job_cv_item($_POST["cv_item"]);
					$p=job_cv_item_project::create($i);
					die(json_encode(array('status' => 'success', 'id' => $p->id)));
				break;
			}
		}elseif(isset($_POST["remove"])){
			switch ($_POST["remove"]) {
				case 'skill':
					$s=new job_skill($_POST["pk"]);
					$s->delete();
					die(json_encode(array('status' => 'success')));
				break;
				case 'cv':
					$c=new job_cv($_POST["pk"]);
					$c->delete();
					die(json_encode(array('status' => 'success')));
				break;
				case 'cv_item':
					$i=new job_cv_item($_POST["pk"]);
					$i->delete();
					die(json_encode(array('status' => 'success')));
				break;
				case 'cv_item_project':
					$p=new job_cv_item_project($_POST["pk"]);
					$p->delete();
					die(json_encode(array('status' => 'success')));
				break;
			}
		}elseif (isset($_POST["remove_me"])) {
			$job->delete();
			die("success");
		}elseif (isset($_POST["transform"])) {
			$job->transform_to($_POST["transform"]);
			die("success");
		}elseif (isset($_POST["new_category"])) {
			$new_category = category::create();
			$new_category->name = $_POST["new_category"];
			$new_category->service = 1;
			$new_category->product = 1;
			$new_category->portfolio = 1;
			$new_category->parent = $job->categories[0];
			die(json_encode(array("status"=>"success",
				"params"=>array("id"=>$new_category->id, "text"=>$_POST["new_category"])
			)));
		}

		$available_categories = array();
		foreach (category::get_available_for('job') as $c) $available_categories[] = array("id"=>intval($c->id), "text"=>$c->name);

		$available_portfolio_categories = array();
		foreach (category::get_available_for('portfolio', $categories_obj) as $c) $available_portfolio_categories[] = array("id"=>intval($c->id), "text"=>$c->name);

		include "view_2.php";
	}elseif($is_contracted){

		if(isset($_GET["portfolio"])) $po=new portfolio($_GET["portfolio"]);
		// defining seo parameters
		if(isset($ogp)){
			if(isset($po)){
				$po_name = $po->name;
				$ogp->setTitle( ($po_name? $po_name : $job->name ) );
				$po_description = $po->description;
				$ogp->setDescription( ($po_description? $po_description : $job->description ) );

        $ogp->setURL( url_root."/".urlencode($po->url) );

        $ogp->setType( 'article' );

        $seo_img = $po->image;
        if($seo_img){
					$img_path=$paths->portfolio_image->url.$seo_img;
					$image = new OpenGraphProtocolImage();
          $image->setURL( url_root.$img_path );
          $image->setSecureURL( str_replace("http://", "https://", url_root.$img_path) );
          $image->setType( 'image/jpeg' );
          $ogp->addImage($image);

          $ref["twitter:image:src"] = url_root.$img_path;
        }

        $article = new OpenGraphProtocolArticle();
        $article->setPublishedTime( date(DATE_ISO8601, strtotime($po->creation_time)) );
        $article->setModifiedTime( new DateTime( 'now', new DateTimeZone( 'Africa/Tunis' ) ) );
        $article->setSection( get_class($po) );

        foreach(array_filter(explode(",",$categories)) as $c) $article->addTag( $c );

        $ref["twitter:title"] = $po->name;
        $ref["twitter:description"] = $po->description;
			}else{
	      $ogp->setTitle( $job->name );
	      $ogp->setDescription( $job->description );
	      $ogp->setURL( url_root."/".urlencode($job->url) );

	      $ogp->setType( 'article' );

	      $seo_img = $job->image;
	      if($seo_img){
          $image = new OpenGraphProtocolImage();
          $image->setURL( url_root.$paths->job_image->url.$seo_img );
          $image->setSecureURL( str_replace("http://", "https://", url_root.$paths->job_image->url.$seo_img) );
          $image->setType( 'image/jpeg' );
          $ogp->addImage($image);

          $ref["twitter:image:src"] = url_root.$paths->job_image->url.$seo_img;
	      }

	      $article = new OpenGraphProtocolArticle();
	      $article->setPublishedTime( date(DATE_ISO8601, strtotime($job->creation_time)) );
	      $article->setModifiedTime( new DateTime( 'now', new DateTimeZone( 'Africa/Tunis' ) ) );
	      $article->setSection( 'Job' );
	      foreach(array_filter(explode(",",$categories)) as $c) $article->addTag( $c );

	      $ref["twitter:title"]=$job->name;
        $ref["twitter:description"]=$job->description;
	    }
		}
		$job->requests += 1;

		$p_list = array();
		$p_list_categories = array();

		foreach ($job->portfolio as $e) {
			$p_categories = array();
			foreach ($e->categories as $c) {
				$p_categories[] = $c->id;
				if(!in_array($c, $p_list_categories)) $p_list_categories[] = $c;
			}
			$p_list[] = array(
				"id"=>$e->id,
				"type"=>get_class($e),
				"name"=>$e->name,
				"description"=>$e->description,
				"image"=>($e->image ? $paths->portfolio_image->url.$e->image : null),
				"url"=>url_root."/".$e->url,
				"categories"=>$p_categories,
				"creation_time"=>$e->creation_time
			);
		}
		$count_p_list = count($p_list);

		$cv_list = $job->cv;
		$count_cv = count($cv_list);
		include "view_1.php";
	}else{
		include __DIR__."/../404/controller.php";goto skip_this_page;
	}

	skip_this_page:
?>
