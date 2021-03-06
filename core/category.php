<?php
  class category{

    private $id;

    public function __construct($nid){
      $this->id = $nid;
    }

    public function __set($name,$value){
      global $db;
      if ($this->id != NULL) {
        switch($name){
          case "parent":
            if($value) $this->id_parent = $value->id;
            else $this->id_parent = null;
          break;
          default :
            $db->query("update category set ".$name."=".($value===null?"NULL":"'".$db->real_escape_string($value)."'")." where (id='".$this->id."')");
          break;
        }
      }
    }

    public function __get($name){
      global $db;
      if ($this->id != NULL) {
        switch($name){
          case "id":
            return $this->id;
          break;
          case "isvalid":
            $q=$db->query("select count(*) from category where (id='".$this->id."')");
            $r=$q->fetch_row();
            return $r[0]==1;
          break;

          case 'is_root':
            $q=$db->query("select id_parent from category where (id='".$this->id."')");
            $r=$q->fetch_row();
            return !$r[0];
          break;

          case "has_childrens":
            $q=$db->query("select count(*) from category_children where (id_category='".$this->id."')");
            $r=$q->fetch_row();
            return !!$r[0];
          break;
          case "has_pages":
            $q=$db->query("select count(*) from category_children where (id_category='".$this->id."' and (children_type='company' or children_type='shop' or children_type='job'))");
            $r=$q->fetch_row();
            return !!$r[0];
          break;
          case "childrens":
            return array_merge($this->companies, $this->shops, $this->jobs, $this->products, $this->services, $this->portfolios);
          break;

          case "parent":
            $q=$db->query("select id_parent from category where (id='".$this->id."')");
            $r=$q->fetch_row();
            if($r[0]) return new category($r[0]);
            else return null;
          break;
          case "count_sub_categories":
            $q=$db->query("select count(*) from category where (id_parent='".$this->id."')");
            $r=$q->fetch_row();
            return $r[0];
          break;
          case "sub_categories":
            $list = array();
            $q=$db->query("select id from category where (id_parent='".$this->id."') ORDER BY name");
            while($r=$q->fetch_row()) $list[] = new category($r[0]);
            return $list;
          break;

          case "all_subcategories_list":
            return $this->get_subcategories_list();
          break;
          case "all_subcategories_tree":
            return $this->get_subcategories_tree();
          break;

          case "companies":
            $list = array();
            $q=$db->query("select id_children from category_children where (id_category='".$this->id."' and children_type='company')");
            while($r=$q->fetch_row()) $list[] = new company($r[0]);
            return $list;
          break;
          case "shops":
            $list = array();
            $q=$db->query("select id_children from category_children where (id_category='".$this->id."' and children_type='shop')");
            while($r=$q->fetch_row()) $list[] = new shop($r[0]);
            return $list;
          break;
          case "jobs":
            $list = array();
            $q=$db->query("select id_children from category_children where (id_category='".$this->id."' and children_type='job')");
            while($r=$q->fetch_row()) $list[] = new job($r[0]);
            return $list;
          break;
          case "products":
            $list = array();
            $q=$db->query("select id_children from category_children where (id_category='".$this->id."' and children_type='product')");
            while($r=$q->fetch_row()) $list[] = new product($r[0]);
            return $list;
          break;
          case "services":
            $list = array();
            $q=$db->query("select id_children from category_children where (id_category='".$this->id."' and children_type='service')");
            while($r=$q->fetch_row()) $list[] = new service($r[0]);
            return $list;
          break;
          case "portfolios":
            $list = array();
            $q=$db->query("select id_children from category_children where (id_category='".$this->id."' and children_type='portfolio')");
            while($r=$q->fetch_row()) $list[] = new portfolio($r[0]);
            return $list;
          break;

          default:
            $q=$db->query("select ".$name." from category where (id='".$this->id."')");
            $r=$q->fetch_row();
            return $r[0];
          break;
        }
      }else{
        return NULL;
      }
    }

    public static function get_by_name($name){
      global $db;
      $q=$db->query("select id from category where (name='".$db->real_escape_string($name)."')");
      if($q->num_rows>0){
        $r=$q->fetch_row();
        return new category($r[0]);
      }else{
        $category = category::create();
        $category->name = $name;
        return $category;
      };
    }

    public static function get_all(){
      global $db;
      $rslt=array();
      $q=$db->query("select id from category");
      while ($r=$q->fetch_row()) $rslt[] = new category($r[0]);
      return $rslt;
    }

    public static function get_roots(){
      global $db;
      $rslt=array();
      $q=$db->query("select id from category where id_parent is NULL ORDER BY name");
      while ($r=$q->fetch_row()) $rslt[] = new category($r[0]);
      return $rslt;
    }

    public static function get_available_for($type, $in=null){
      if($in){
        $rslt = array();
        foreach ($in as $c) {
          if(!in_array($c, $rslt)){
            switch ($type) {
              case 'product':
                if($c->product) $rslt[]=$c;
                break;
              case 'service':
                if($c->service) $rslt[]=$c;
                break;
              case 'portfolio':
                if($c->portfolio) $rslt[]=$c;
                break;
              case 'job':
                if($c->job_publish_price) $rslt[]=$c;
                break;
              case 'shop':
                if($c->shop_publish_price) $rslt[]=$c;
                break;
              case 'company':
                if($c->company_publish_price) $rslt[]=$c;
                break;
            }
          }
          foreach ($c->get_subcategories_list() as $sc) {
            if(!in_array($sc, $rslt)){
              switch ($type) {
                case 'product':
                  if($sc->product) $rslt[]=$sc;
                  break;
                case 'service':
                  if($sc->service) $rslt[]=$sc;
                  break;
                case 'portfolio':
                  if($sc->portfolio) $rslt[]=$sc;
                  break;
                case 'job':
                  if($sc->job_publish_price) $rslt[]=$sc;
                  break;
                case 'shop':
                  if($sc->shop_publish_price) $rslt[]=$sc;
                  break;
                case 'company':
                  if($sc->company_publish_price) $rslt[]=$sc;
                  break;
              }
            }
          }
        }
        return $rslt;
      }else{
        global $db;
        switch ($type) {
          case 'product':
            $rslt=array();
            $q=$db->query("select id from category where ifnull(product, 0) > 0");
            while ($r=$q->fetch_row()) $rslt[] = new category($r[0]);
            return $rslt;
            break;
          case 'service':
            $rslt=array();
            $q=$db->query("select id from category where ifnull(service, 0) > 0");
            while ($r=$q->fetch_row()) $rslt[] = new category($r[0]);
            return $rslt;
            break;
          case 'portfolio':
            $rslt=array();
            $q=$db->query("select id from category where ifnull(portfolio, 0) > 0");
            while ($r=$q->fetch_row()) $rslt[] = new category($r[0]);
            return $rslt;
            break;
          default:
            $rslt=array();
            $q=$db->query("select id from category where ifnull(".$type."_publish_price, 0) > 0");
            while ($r=$q->fetch_row()) $rslt[] = new category($r[0]);
            return $rslt;
            break;
        }
      }
    }

    public static function create(){
      global $db;
      $db->query("insert into category values()");
      return new category($db->insert_id);
    }

    public function delete(){
      global $db;
      $db->query("delete from category where (id='".$this->id."')");
      $db->query("delete from category_children where (id_category='".$this->id."')");
    }

    public function assign_to_category($category){
      global $db;
      if($category == $this || in_array($category, $this->subcategories_list())) return "unallowed_loopback_hierarchy";
      $db->query("replace into category_children (id_category, id_children, children_type) values('".$category->id."', '".$this->id."', 'category')");
    }

    public function unassign_from_category($category){
      global $db;
      $db->query("delete from category_children where (id_category='".$category->id."' and id_children='".$this->id."' and children_type='category')");
    }

    private function get_subcategories_tree(){
      $list=array();
      foreach($this->sub_categories as $sc){
        $list[]=array("category" => $sc, "subcategories" => $sc->get_subcategories_tree());
      }
      return $list;
    }
    private function get_subcategories_list(){
      $list=array();
      foreach($this->sub_categories as $sc){
        $list[]=$sc;
        $list=array_merge($list, $sc->get_subcategories_list());
      }
      return $list;
    }

  }
?>
