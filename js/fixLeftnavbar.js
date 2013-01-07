$(function () {
    
    var sectionTitles = $("#leftnavbar a[href^=#]").map(function(i, el) { return $(el).attr("href"); });
    var sectionTitleHeights = [];
    var height = $(window).height();
    var width = $(window).width();
    var originalLeftnavHeight = $("#leftnavbar").height();
    
    var calculateSectionTitleHeights = function () {
        $(sectionTitles).each(function (i, el) {
            var $el = $(el);
            if ($el.length) {
                sectionTitleHeights[i] = $el.offset().top;
            }
        });
    };

    var updateLeftnavbarHeight = function () {
        var $leftnavbar = $("#leftnavbar");
        if (width > 768) {
            var magicNumber = 45; // selected to position it nicely from bottom
            if (width > 980) {
                magicNumber = 116;
            }
            if (height < originalLeftnavHeight + magicNumber) {
                $leftnavbar.css({
                    height: height-magicNumber,
                    overflow: "scroll"
                });
            } else {
                $leftnavbar.css({
                    height: "auto",
                    overflow: "hidden"
                });
            }
        } else {
            $leftnavbar.css({
                height: "auto",
                overflow: "hidden"
            });
        }
    };

    var updateActiveLeftnavbar = function () {
        var windowScrollTop = $(window).scrollTop();
        var thirdHeight = height / 3;
        calculateSectionTitleHeights();
        $(sectionTitleHeights).each(function(i, el) {
            if (windowScrollTop-el+thirdHeight > 0) {
                $("a[href=" + sectionTitles[i] + "]").parent("li").addClass("active");
            } else {
                $("a[href=" + sectionTitles[i] + "]").parent("li").removeClass("active");
            }
        });
        var $leftnavbar = $("#leftnavbar");
        var $active = $leftnavbar.find(".active").removeClass("active").last().addClass("active");
        
        if ($leftnavbar.hasClass("affix")) {
            if ($active.length) {

                // below is stuff to do with making sure the active element is visible 
                // if the leftnavbar is shrunk vertically to fit on screen
                var windowScrollTop = $(window).scrollTop();
                var leftnavbarTop = $leftnavbar.offset().top - windowScrollTop;
                var leftnavbarHeight = $leftnavbar.outerHeight();
                var leftnavbarScrolltop = $leftnavbar.scrollTop();
                var activeTop = $active.position().top + leftnavbarScrolltop;
                var activeHeight = $active.outerHeight();

                if (leftnavbarScrolltop > activeTop) {
                    $leftnavbar.scrollTop(activeTop);
                } else if (leftnavbarScrolltop + leftnavbarHeight < activeTop + activeHeight) {
                    $leftnavbar.scrollTop(activeTop - leftnavbarHeight + activeHeight);
                }

            } else {
                $leftnavbar.scrollTop(0);
            }
        }
    };

    updateLeftnavbarHeight();
    
    $(window).resize(function () {
        height = $(window).height();
        width = $(window).width();
        updateLeftnavbarHeight();
    });

    $("#leftnavbar").scroll(function (event) {
        event.stopPropagation();
        event.preventDefault();
    });
    
    $(window).scroll(updateActiveLeftnavbar);
});