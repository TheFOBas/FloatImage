<?php
/**
 * Created by PhpStorm.
 * User: Nerijus
 * Date: 2015-01-13
 * Time: 11:42
 */

namespace Plugin\FloatImage;


class Event {
    public static function ipBeforeController(){
        if (ipAdminId()){
            ipAddJs('assets/floatImage.js');
        }
        ipAddCss('assets/floatImage.css');
    }

    public static function ipWidgetDuplicated($data){
        $oldId = $data['oldWidgetId'];
        $newId = $data['newWidgetId'];

        $widgetData = ipStorage()->get('FloatImage', 'widget_'.$oldId, false);
        if ($widgetData){
            ipStorage()->set('FloatImage', 'widget_'.$newId, $widgetData);
        }
        $floatImageWidth = ipStorage()->get('FloatImageWidth', 'widget_'.$oldId, false);
        if ($floatImageWidth){
            ipStorage()->set('FloatImageWidth', 'widget_'.$newId, $floatImageWidth);
        }
    }

} 
