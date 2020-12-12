let customSearch;
let scrollCorrection = 70;
let apFixed;

let scrollToElement = (elem, correction) => {
    correction = correction || scrollCorrection;
    let $elem = elem.href ? $(elem.getAttribute('href')) : $(elem);
    $('html, body').animate({ 'scrollTop': $elem.offset().top - correction }, 500);
};

let initCustomSearch = () => {
    if (CONFIG.search_service === 'google') {
        customSearch = new GoogleCustomSearch({
            apiKey: GOOGLE_CUSTOM_SEARCH_API_KEY,
            engineId: GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
            imagePath: "/images/"
        });
    } else if (CONFIG.search_service === 'algolia') {
        customSearch = new AlgoliaSearch({
            apiKey: ALGOLIA_API_KEY,
            appId: ALGOLIA_APP_ID,
            indexName: ALGOLIA_INDEX_NAME,
            imagePath: "/images/"
        });
    } else if (CONFIG.search_service === 'hexo') {
        customSearch = new HexoSearch({
            imagePath: "/images/"
        });
    } else if (CONFIG.search_service === 'azure') {
        customSearch = new AzureSearch({
            serviceName: AZURE_SERVICE_NAME,
            indexName: AZURE_INDEX_NAME,
            queryKey: AZURE_QUERY_KEY,
            imagePath: "/images/"
        });
    } else if (CONFIG.search_service === 'baidu') {
        customSearch = new BaiduSearch({
            apiId: BAIDU_API_ID,
            imagePath: "/images/"
        });
    }
}

let initHeaderMenu = () => {
    let $headerMenu = $('header .menu');
    let $underline = $headerMenu.find('.underline');

    function setUnderline($item, transition) {
        $item = $item || $headerMenu.find('li a.active');//get instant
        transition = transition === undefined ? true : !!transition;
        if (!transition) $underline.addClass('disable-trans');
        if ($item && $item.length) {
            $item.addClass('active').siblings().removeClass('active');
            $underline.css({
                left: $item.position().left,
                width: $item.innerWidth()
            });
        } else {
            $underline.css({
                left: 0,
                width: 0
            });
        }
        if (!transition) {
            setTimeout(function () {
                $underline.removeClass('disable-trans')
            }, 0);//get into the queue.
        }
    }

    $headerMenu.on('mouseenter', 'li', function (e) {
        setUnderline($(e.currentTarget));
    });
    $headerMenu.on('mouseout', function () {
        setUnderline();
    });
    //set current active nav
    let $active_link = null;
    if (location.pathname === '/' || location.pathname.startsWith('/page/')) {
        $active_link = $('.nav-home', $headerMenu);
    } else {
        let pathname = location.pathname;
        pathname = pathname[pathname.length - 1] === '\/' ? pathname : pathname + '\/';
        let name = pathname.match(/\/(.*?)\//);
        if (name.length > 1) {
            $active_link = $('.nav-' + name[1], $headerMenu);
        }
    }
    setUnderline($active_link, false);
};

// only once
let initHeaderMenuPhone = () => {
    let $switcher = $('.l_header .switcher .s-menu');
    $switcher.click(function (e) {
        e.stopPropagation();
        $('body').toggleClass('z_menu-open');
        $switcher.toggleClass('active');
    });
    $(document).click(function (e) {
        $('body').removeClass('z_menu-open');
        $switcher.removeClass('active');
    });
};

// only once
let initHeaderSearch = () => {
    let $switcher = $('.l_header .switcher .s-search');
    let $header = $('.l_header');
    let $search = $('.l_header .m_search');
    if ($switcher.length === 0) return;
    $switcher.click(function (e) {
        e.stopPropagation();
        $header.toggleClass('z_search-open');
        $search.find('input').focus();
    });
    $(document).click(function (e) {
        $header.removeClass('z_search-open');
    });
    $search.click(function (e) {
        e.stopPropagation();
    })
};


// only once
let initHeaderIconTop = () => {
    let $wrapper = $('header .wrapper');
    let $top = $('.s-top', $wrapper);
    $top.click(() => scrollToElement(document.body))
}

let initHeaderIconDown = () => {
    let $wrapper = $('header .wrapper');
    let $down = $('.s-down', $wrapper);
    let $downTarget = $('#footer');
    $down.click(e => {
        e.preventDefault();
        e.stopPropagation();
        scrollToElement($downTarget);
    });
}

let initHeaderIconComment = () => {
    let $wrapper = $('header .wrapper');
    let $comment = $('.s-comment', $wrapper);
    let $down = $('.s-down', $wrapper);
    let $commentTarget = $('.comment');
    if ($commentTarget.length) {
        $down.hide();
        $comment.unbind("click");
        $comment.show();
        $comment.click(e => {
            e.preventDefault();
            e.stopPropagation();
            scrollToElement($commentTarget);
        });
    } else {
        $comment.hide();
        $down.show();
    }
}

let initHeader = () => {
    // header init, clear active
    let $headerMenu = $('header .menu');
    let $item = $headerMenu.find('li a.active');
    if ($item && $item.length) {
        $item.removeClass('active');
    }

    if (!window.subData) return;
    let $wrapper = $('header .wrapper');

    $wrapper.find('.nav-sub .logo').text(window.subData.title);
    let pos = document.body.scrollTop;
    $(document, window).scroll(() => {
        let scrollTop = $(window).scrollTop();
        let del = scrollTop - pos;
        if (del >= 50 && scrollTop > 100) {
            pos = scrollTop;
            $wrapper.addClass('sub');
        } else if (del <= -50) {
            pos = scrollTop;
            $wrapper.removeClass('sub');
        }
    });
};

let initWaves = () => {
    Waves.attach('.flat-btn', ['waves-button']);
    Waves.attach('.float-btn', ['waves-button', 'waves-float']);
    Waves.attach('.float-btn-light', ['waves-button', 'waves-float', 'waves-light']);
    Waves.attach('.flat-box', ['waves-block']);
    Waves.attach('.float-box', ['waves-block', 'waves-float']);
    Waves.attach('.waves-image');
    Waves.init();
};

let initReveal = () => {
    let $reveal = $('.reveal');
    if ($reveal.length === 0) return;
    let sr = ScrollReveal({ distance: '0px', easing: 'ease-in' });
    sr.destroy();
    sr.reveal('.reveal');
};


let initToc = () => {
    if (!$('.toc-wrapper').length)
        return;
    $('.toc-wrapper a').unbind('click');
    $('.toc-wrapper a').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        scrollToElement(this);
    });
};


let initEssay = () => {
    $('#digest, #open').fadeOut(1000, () => {
        $('#content').fadeIn(1000);
    });
}


let initSince = () => {
    window.setTimeout(function () {
        initSince();
    }, 1000);
    var BirthDay = new Date(CONFIG.since);
    var today = new Date();
    var timeold = (today.getTime() - BirthDay.getTime());
    var msPerDay = 24 * 60 * 60 * 1000;
    var e_daysold = timeold / msPerDay;
    var daysold = Math.floor(e_daysold);
    var e_hrsold = (e_daysold - daysold) * 24;
    var hrsold = Math.floor(e_hrsold);
    var e_minsold = (e_hrsold - hrsold) * 60;
    var minsold = Math.floor((e_hrsold - hrsold) * 60);
    var seconds = Math.floor((e_minsold - minsold) * 60);
    $('#since').html(daysold + "天" + hrsold + "时" + minsold + "分" + seconds + "秒");
}

// 背景
let initEvanyou = () => {
    if (document.getElementById('evanyou')) {
        var c = document.getElementById('evanyou'),
            x = c.getContext('2d'),
            pr = window.devicePixelRatio || 1,
            w = window.innerWidth,
            h = window.innerHeight,
            f = 90,
            q,
            m = Math,
            r = 0,
            u = m.PI * 2,
            v = m.cos,
            z = m.random
        c.width = w * pr
        c.height = h * pr
        x.scale(pr, pr)
        x.globalAlpha = 0.6
        function evanyou() {
            x.clearRect(0, 0, w, h)
            q = [{ x: 0, y: h * .7 + f }, { x: 0, y: h * .7 - f }]
            while (q[1].x < w + f) d(q[0], q[1])
        }
        function d(i, j) {
            x.beginPath()
            x.moveTo(i.x, i.y)
            x.lineTo(j.x, j.y)
            var k = j.x + (z() * 2 - 0.25) * f,
                n = y(j.y)
            x.lineTo(k, n)
            x.closePath()
            r -= u / -50
            x.fillStyle = '#' + (v(r) * 127 + 128 << 16 | v(r + u / 3) * 127 + 128 << 8 | v(r + u / 3 * 2) * 127 + 128).toString(16)
            x.fill()
            q[0] = q[1]
            q[1] = { x: k, y: n }
        }
        function y(p) {
            var t = p + (z() * 2 - 1.1) * f
            return (t > h || t < 0) ? y(p) : t
        }
        // document.onclick = evanyou
        // document.ontouchstart = evanyou
        evanyou()
    }
}


let initAplayer = () => {
    if (document.getElementById('aplayer-fixed')) {
        apFixed = new APlayer({
            element: document.getElementById('aplayer-fixed'),
            mutex: true,
            order: 'list',
            lrcType: 3,
            fixed: true,
        });
        apFixed.lrc.hide();
        $.ajax({
            url: 'https://api.i-meto.com/meting/api?server=netease&type=playlist&id=2663347612',
            success: function (list) {
                apFixed.list.add(JSON.parse(JSON.stringify(list)));
            }
        });
    }
}


let initCount = (content) => {
    let counter = function (content) {
        const cn = (content.match(/[\u4E00-\u9FA5]/g) || []).length;
        const en = (content.replace(/[\u4E00-\u9FA5]/g, '').match(/[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g) || []).length;
        return [cn, en];
    };
    let len = counter(content);
    let count = len[0] + len[1];
    let cn = 300;
    let en = 160;
    let wordcount = count < 1000 ? count : Math.round(count / 100) / 10 + 'k';
    let readingTime = len[0] / cn + len[1] / en;
    let min2read = readingTime < 1 ? '1' : parseInt(readingTime, 10);
    $('#wordcount').text(wordcount);
    $('#min2read').text(min2read);
}


let lazyImage = () => {
    $('img').not('.avatar').each(function () {
        let $image = $(this);
        let src = $image.attr('src');
        if ($image.attr('data-original')) return;
        if ($image.attr('class') && !$image.hasClass('lazy')) {
            $image.attr('class', $image.attr('class') + " lazy");
        } else {
            $image.attr('class', 'lazy');
        }
        $image.attr('data-original', src);
        $image.removeAttr('src');
    });
};

let wrapImage = () => {
    $('img').not('.avatar').not('.thumb').each(function () {
        let $image = $(this);
        if ($image.attr('data-src')) return;
        let imageCaption = $image.attr('alt');
        let $imageWrapLink = $image.parent('a');

        if ($imageWrapLink.length < 1) {
            let src = $image.attr('data-original');
            if (src == undefined) return;
            let idx = src.lastIndexOf('?');
            if (idx !== -1) {
                src = src.substring(0, idx);
            }
            $imageWrapLink = $image.wrap('<a href="' + src + '"></a>').parent('a');
        }
        $imageWrapLink.attr('data-fancybox', 'gallery');
        if (imageCaption) {
            $imageWrapLink.attr('data-caption', imageCaption);
        }
    });
};

let loadImage = () => {
    $("img.lazy").lazyload({
        effect: 'fadeIn',
        threshold: 50,
    });
};

let initImage = () => {
    // if not gallery, no need to init image
    if (location.pathname.startsWith('/blog/gallery/'))
        return;
    lazyImage();
    wrapImage();
    loadImage();
};

let initGallery = () => {
    if (!location.pathname.startsWith('/blog/gallery/'))
        return;
    let pics = [];
    const gallery = document.getElementById('gallery');
    const createElements = pic => {
        let img = document.createElement('img');
        img.setAttribute("src", pic.url);
        let div = document.createElement('div');
        let divStyle = "flex-grow:" + pic.width * 100 / pic.height + ";flex-basis:" + pic.width * 200 / pic.height + "px;"
        div.setAttribute('style', divStyle);
        let i = document.createElement('i');
        let iStyle = "padding-bottom:" + pic.height / pic.width * 100 + "%";
        i.setAttribute("style", iStyle);
        div.appendChild(i);
        div.appendChild(img);
        gallery.appendChild(div);
    };
    const removeElements = elem => {
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }
    };
    const initialize = () => {
        removeElements(gallery);
        pics.forEach(createElements);
        document.body.scrollTop = 0;
    };

    fetch('/blog/gallery/data.json')
        .then(res => res.json())
        .then(images => {
            pics = images.pics;
            initialize();
            lazyImage();
            wrapImage();
            loadImage();
        });
};

let init = () => {
    initCustomSearch();
    initHeader();
    initHeaderIconTop();
    initHeaderIconDown();
    initHeaderIconComment();
    initHeaderMenu();
    initHeaderMenuPhone();
    initHeaderSearch()
    initWaves();
    initReveal();
    initToc();
    initGallery();
    initImage();
    initSince();
    initAplayer();
    initEvanyou();
};

let pjax_init = () => {
    initHeader();
    initHeaderIconComment();
    initHeaderMenu();
    initWaves();
    initReveal();
    initToc();
    initGallery();
    initImage();
    initEvanyou();
};
