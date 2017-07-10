(function($) {
    var actions = {
        start: function() {
            var $preloader = $("<div id='jpreloader' class='preloader-overlay'><div class='loader' style='text-align: center;position:absolute;left:50%;top:50%;margin-left:-24px;margin-top:-24px;'><img src='img/preloader.gif'/> <br/>Идёт загрузка...</div></div>");
            $preloader.css({
                'background-color': 'transparent',
                'width': '100%',
                'height': '100%',
                'left': '0',
                'top': '0',
                'opacity': '0.3',
                'z-index': '100',
                'position': 'absolute'
            });
            this.append($preloader);
        },

        stop: function() {
            this.find('.preloader-overlay').remove();
        }
    };
    
    $.fn.preloader = function(action) {        
        actions[action].apply(this);
        return this;
    };
}(jQuery));