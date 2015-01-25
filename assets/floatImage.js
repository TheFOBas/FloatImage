/**
 * Drops
 */

(function ($) {
    var lastDroppable = false;

    var force = false;
    function startDrag(event, ui){
        var draggingElement = event.currentTarget;
        var placeholders = [];

        $('.ipWidget-Text').not($(draggingElement)).each(function (key, value) {
            var dragId = $(draggingElement).data('widgetid');
            var prevId = $(value).prev().data('widgetid');

            var button = $(draggingElement).hasClass('ipsAdminPanelWidgetButton');
            if (dragId != prevId || !$(draggingElement).hasClass('float-right') || button){
                placeholders.push({
                    left: $(value).offset().left + $(value).width() - 110,
                    top: $(value).offset().top+10,
                    height: 80,
                    width: 80,
                    widgetId: $(value).data('widgetid'),
                    side: 'right',
                    force: (dragId == prevId)
                });
            }

            if (dragId != prevId || !$(draggingElement).hasClass('float-left') || button) {
                placeholders.push({
                    left: $(value).offset().left+10,
                    top: $(value).offset().top+10,
                    height: 80,
                    width: 80,
                    widgetId: $(value).data('widgetid'),
                    side: 'left',
                    force: (dragId == prevId)
                });
            }

            if (dragId == prevId && $(draggingElement).hasClass('floatWidget')){
                placeholders.push({
                    left: $(value).offset().left + 120,
                    top: $(value).offset().top + 10,
                    height: 80,
                    width: $(value).outerWidth() - 240,
                    widgetId: $(value).data('widgetid'),
                    side: 'false',
                    force: (dragId == prevId)
                });
            }
        });

        $.each(placeholders, function (key, value) {
            var $droppable = $('<div class="floatImagePlaceholder"><div class="_marker"></div></div>');
            $('body').append($droppable);
            $droppable.css('position', 'absolute');
            $droppable.css('left', value.left + 'px');
            $droppable.css('top', value.top + 'px');
            $droppable.css('width', value.width + 'px');
            $droppable.css('height', value.height + 'px');
            $droppable.data('position', value.position);
            $droppable.data('widgetId', value.widgetId);
            $droppable.data('paragraph', 1);
            $droppable.data('side', value.side);
            $droppable.data('force', value.force);
        });

        $('.floatImagePlaceholder').droppable({
            accept: "#ipAdminWidgetButton-Image, .ipWidget-Image",
            activeClass: "",
            hoverClass: "_hover",
            greedy: true,
            over: function (event, ui) {
                $(this).data('hover', true);
                lastDroppable = $(this);
                event.stopPropagation();
            },
            out: function (event, ui) {
                $(this).data('hover', false);
            },
            drop: function (event, ui) {
            }
        });
    }

    function stopDrag(event, ui){

        if (lastDroppable && lastDroppable.data('hover') && lastDroppable.data('force')){
            var $widget = $(event.target);
            var widgetId = $widget.data('widgetid');
            makeDrop(widgetId);
        }
    }

    function saveData(widgetId, float){
        $.ajax(ip.baseUrl, {data : {aa: 'FloatImage.setWidgetFloat', widgetId: widgetId,  float: float}});
    }

    function makeDrop(widgetId){
        if (!widgetId){
            return;
        }
        var $widget = $('#ipWidget-' + widgetId);
        $widget.removeClass('floatWidget');
        $widget.removeClass('float-right');
        $widget.removeClass('float-left');
        if (lastDroppable && lastDroppable.data('hover')){
            if (lastDroppable.data('side') != 'false'){
                $widget.addClass('floatWidget float-'+lastDroppable.data('side'));
                $widget.css('width', '50%');
                saveData(widgetId, lastDroppable.data('side'));
            } else {
                $widget.css('width', 'inherit');
                saveData(widgetId, 'false');
            }
        } else {
            $widget.css('width', 'inherit');
            saveData(widgetId, 'false');
        }
        lastDroppable = false;
        $('.floatImagePlaceholder').remove();

        $(document).trigger('floatChanged');
    }

    function fixFloats(){
        var $floatingWidgets = $('.floatWidget');
        $floatingWidgets.each(function (key, value) {
            var $widget = $(value);
            var $next = $widget.next();
            if (!$next || !$next.hasClass('ipWidget-Text')){
                $widget.removeClass('floatWidget');
                $widget.removeClass('float-right');
                $widget.removeClass('float-left');
                $widget.css('width', 'inherit');
                saveData($widget.data('widgetid'), 'false');
            }
        });
    }

    $(document).on('ipWidgetMoved ipWidgetAdded', function(e, data){
        makeDrop(data.widgetId);
    });

    $(document).on('ipWidgetDeleted ipWidgetMoved ipWidgetAdded ipWidgetSaved', function(e, data){
        fixFloats();
    });

    $(document).on('ipContentManagementInit', function(){
        $('.ipsAdminPanelWidgetButton')
            .on('dragstart', startDrag)
            .on('dragstop', stopDrag);
    });


    $('.ipBlock .ipWidget')
        .on('dragstart.ipContentManagement', startDrag)
        .on('dragstop.ipContentManagement', stopDrag);

    $(document).on('ipWidgetReinit', function () {
        $('.ipBlock .ipWidget')
            .on('dragstart.ipContentManagement', startDrag)
            .on('dragstop.ipContentManagement', stopDrag);
    });

})(jQuery);

/**
 * Resize
 */
(function ($) {
    var $handler = $('<div class="ipAdminWidgetColsResizeHandler ipsAdminWidgetColsWidthHandler floatImageHandle"></div>');

    function initFloatHandles(){
        $('.floatImageHandle').remove();
        var $widgets = $('.ipWidget.floatWidget');
        $.each($widgets, function (index, widget) {
            var $newHandler = $handler.clone();
            var $widget = $(widget);
            $newHandler.css('position', 'absolute');
            if ($widget.hasClass('float-left')){
                $newHandler.css('left', $widget.offset().left + $widget.outerWidth());
            } else {
                $newHandler.css('left', $widget.offset().left);
            }

            $newHandler.css('top', $widget.offset().top + 'px');
            $newHandler.css('height', $widget.height() + 'px');

            if ($widget.height() == 0){
                $newHandler.css('height', $widget.next().height() + 'px');
            }

            $newHandler.draggable({
                axis: "x",
                drag: function (event, ui) {
                    if ($widget.hasClass('float-left')){
                        var markerPosition = $newHandler.offset().left - $widget.parent().offset().left;
                        var percent = markerPosition * 100 / $widget.parent().outerWidth();
                    } else {
                        var markerPosition = ($widget.parent().offset().left + $widget.parent().outerWidth()) - $newHandler.offset().left;
                        var percent = markerPosition * 100 / $widget.parent().outerWidth();
                    }

                    $widget.css('width', percent + '%');
                },
                stop: function (event, ui) {
                    $.ajax(ip.baseUrl, {data : {aa: 'FloatImage.setWidgetWidth', widgetId: $(widget).data('widgetid'),  width: parseFloat(widget.style.width)}});

                    $(document).trigger('ipWidgetResized');
                }
            });
            $('body').append($newHandler);
        });
    }

    $(document).on('ipContentManagementInit', initFloatHandles);
    $(document).on('ipWidgetAdded', initFloatHandles);
    $(document).on('ipWidgetDeleted', initFloatHandles);
    $(document).on('ipWidgetMoved', initFloatHandles);
    $(document).on('ipWidgetSaved', initFloatHandles);
    $(document).on('floatChanged', initFloatHandles);

})(jQuery);