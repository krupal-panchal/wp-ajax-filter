<?php
/**
 * Enqueue scripts and styles.
 */


//theme supports
add_theme_support( 'post-thumbnails' );

require_once 'includes/cpt.php';
require_once 'includes/taxonomies.php';

function theme_enqueue_scripts() {
	wp_enqueue_style( 'owl-js' , get_template_directory_uri() . '/js/owl.carousel.min.js', array(), _S_VERSION, 'all');
}

// Queue parent style followed by child/customized style
add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles', PHP_INT_MAX);

function theme_enqueue_styles() {
    $data = array(
        'site_url' => site_url(),
        'ajax_url' => admin_url('admin-ajax.php'),
    );

    wp_enqueue_style( 'telus_fund-style', get_template_directory_uri() . '/style.css' );
    // wp_enqueue_style( 'telus_fund-owl', get_template_directory_uri() . '/owl.carousel.min.css' );
     wp_enqueue_style( 'telus_fund-project-style', get_stylesheet_directory_uri() . '/css/project.css' );
	wp_enqueue_style( 'telus_fund-child-style', get_stylesheet_directory_uri() . '/style.css', array( 'telus_fund-style' ) );

    wp_enqueue_script( 'telus_fund-child-custom', get_stylesheet_directory_uri() . '/js/custom.js', array('jquery'), '', true );
    wp_localize_script('telus_fund-child-custom', 'ajax_object', $data);
}


// filter projects

add_action('wp_ajax_nopriv_telus_fund_projects_filter','telus_fund_projects_filter_f');
add_action('wp_ajax_telus_fund_projects_filter','telus_fund_projects_filter_f');

function telus_fund_projects_filter_f(){
    $all = $_POST['all'];
    $post_lang = $_POST['lang'];
    $hsa = $_POST['hsa'];
    $type = $_POST['type'];
    $audience = $_POST['audience'];
    $page = $_POST['page'];
    $str = $_POST['str'];
    $filter = $_POST['filter'];
    $html = '';
    $data = array();

    if(isset($_POST['default_language'])) $default_language = $_POST['default_language']; else $default_language = 'en';

    if($filter == 'load-more'){
        $page = $page + 1;
    }

    if($post_lang == 'false' || empty($post_lang))
    {   
        if($default_language == 'fr')
            $language_term = get_term_by('slug', 'french', 'language');
        else
            $language_term = get_term_by('slug', 'english', 'language');

        $post_lang = $language_term->term_id;
    }

    $args = array(
        'post_type' => 'telus_fund_projects',
        'post_status' => 'publish',
        'posts_per_page' => 16,
        'paged' => $page,
    );
    if($all != "all"){
        
        if($str){ $args['s'] = $str; }

        $args['tax_query']['relation'] = 'AND';
        $lang_arr = array(
            'taxonomy' => 'language',
            'field'    => 'term_id',
            'terms'    => $post_lang,
        );
        $args['tax_query'][] = $lang_arr;
        

        if($hsa != 'false'){
            $args['tax_query']['relation'] = 'AND';
            $hsa_arr = array(
                'taxonomy' => 'health_subject_area',
                'field'    => 'term_id',
                'terms'    => $hsa,
            );
            $args['tax_query'][] = $hsa_arr;
        }

        if($type != 'false'){
            $args['tax_query']['relation'] = 'AND';
            $type_arr = array(
                'taxonomy' => 'type',
                'field'    => 'term_id',
                'terms'    => $type,
            );
            $args['tax_query'][] = $type_arr;
        }

        if($audience != 'false'){
            $args['tax_query']['relation'] = 'AND';
            $audience_arr = array(
                'taxonomy' => 'audience',
                'field'    => 'term_id',
                'terms'    => $audience,
            );
            $args['tax_query'][] = $audience_arr;
        }
    }
    else{
        $args['tax_query']['relation'] = 'AND';
        $lang_arr = array(
            'taxonomy' => 'language',
            'field'    => 'term_id',
            'terms'    => $post_lang,
        );
        $args['tax_query'][] = $lang_arr;
    }

    $the_query = new WP_Query($args);
    if($the_query->have_posts()){
        while($the_query->have_posts()){
            $the_query->the_post();

        $html .= '<div class="cate_box_main">
                    <div class="cate_box">
                        <a href="'.get_the_permalink().'"><figure><img src="'.get_the_post_thumbnail_url().'"></figure></a>
                        <div class="cate_deatils">
                            <h5><a href="'.get_the_permalink().'">'.get_the_title().'</a></h5>
                            <p>'.get_the_excerpt().'</p>
                        </div>
                    </div>
                </div>';

        }
        wp_reset_postdata();
        if($filter == 'load-more') $args['paged'] = $page + 1; else $args['paged'] = $page;
        //print_r($args);
        $the_query = new WP_Query($args);
        if($the_query->have_posts()){
             if($filter == 'load-more') 
                $data['page'] = $page + 1;
            else 
                $data['page'] = $page;
            
        }
        else{
            $data['page'] = 'N';
        }

        $data['status'] = 200;
        $data['html'] = $html;
        
    }
    else{
        $html .= '<p>No Projects Found...!!!</p>';
        $data['status'] = 404;
        $data['html'] = $html;
        $data['page'] = 'N';
    }

    echo json_encode($data);

    exit();
}
?>