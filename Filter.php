<?php
/**
 * Created by PhpStorm.
 * User: Nerijus
 * Date: 2015-01-13
 * Time: 11:42
 */

namespace Plugin\FloatImage;


class Filter {
    public static function ipWidgetHtmlFull($html, $data){
        if ($data['name'] == 'Image'){
            $float = ipStorage()->get('FloatImage', 'widget_'.$data['id'], 'false');
            if ($float !== 'false'){
                $html = str_replace('ipWidget-Image', 'ipWidget-Image floatWidget float-'.$float, $html);

                $width = ipStorage()->get('FloatImageWidth', 'widget_'.$data['id'], 50);
                $html = str_replace('class="ipWidget', 'style="width:'.$width.'%;" class="ipWidget', $html);
            }

        }

        return $html;
    }
} 