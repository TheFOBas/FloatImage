<?php
/**
 * Created by PhpStorm.
 * User: Nerijus
 * Date: 2015-01-13
 * Time: 11:42
 */

namespace Plugin\FloatImage;


class AdminController {
    public function setWidgetFloat(){
        $id = ipRequest()->getRequest('widgetId', false);
        $float = ipRequest()->getRequest('float', 'false');
        ipStorage()->set('FloatImage', 'widget_'.$id, $float);

        ipStorage()->remove('FloatImageWidth', 'widget_'.$id);

        return new \Ip\Response\Json(array('status' => 'success'));
    }

    public function setWidgetWidth(){
        $id = ipRequest()->getRequest('widgetId', false);
        $width = ipRequest()->getRequest('width', 50);
        ipStorage()->set('FloatImageWidth', 'widget_'.$id, $width);

        return new \Ip\Response\Json(array('status' => 'success'));
    }
} 