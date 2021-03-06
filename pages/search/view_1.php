<link href="<?php echo url_root;?>/pages/search/style<?php if(!debug) echo ".min";?>.css" rel="stylesheet" type="text/css">

<div class="row">
	<div class="col-md-12">
  	<?php if(count($rslt)>0){?>
	    <div class="row">

	      <?php foreach ($rslt as $r) {?>

					<div class="col-sm-6 col-md-4">
						<a href="<?php echo $r["url"];?>" class="ajaxify item">
			        <div class="property-box">
		            <div class="property-box-image">
									<?php if($r["image_url"]){?>
										<div class="aspectratio-container aspect-4-3 fit-width">
											<div class="aspectratio-content image" style="background-image:url('<?php echo $r["image_url"];?>');"></div>
										</div>
									<?php }?>
									<?php if(!$r["image_url"]){?>
										<div class="aspectratio-container aspect-4-3 fit-width">
											<div class="aspectratio-content"></div>
										</div>
									<?php }?>
		            </div>
		            <div class="property-box-content">
										<h3><?php echo $r["title"];?></h3>
										<p><?php echo $r["content"];?></p>
										<div class="fb-like" data-href="<?php echo $r["url"];?>" data-layout="button_count" data-action="like" data-show-faces="false" data-share="true"></div>
		            </div>
			        </div>
						</a>
			    </div>

	      <?php } ?>

	    </div>

	  <?php }else{ ?>

		  <div class="alert alert-warning">

				<h4><i class="icon-ban" style="font-size:150%;"></i>&nbsp;&nbsp;&nbsp;&nbsp;Aucun résultat trouvé pour votre requête</h4>
			</div>

		<?php } ?>
	</div>
</div>

<!-- plugins -->
<script type="text/javascript" src="<?php echo cdn;?>/libraries/salvattore<?php if(!debug) echo ".min";?>.js"></script>

<!-- custom page script -->
<script src="<?php echo url_root;?>/pages/search/script_1<?php if(!debug) echo ".min";?>.js" type="text/javascript"></script>
