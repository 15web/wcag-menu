
function Menu(container) {
    var root = container;
    var links = root.querySelectorAll('[aria-haspopup="true"]');
    var ENTER_KEY_CODE = 13;
    var TAB_KEY_CODE = 9;
    var ESC_KEY_CODE = 27;

    [].forEach.call(links, function(link) {
        /* Закрывать подменю будем с задержкой в 300ms через таймер в событиях mouseenter и mouseleave */
        var timer;

        link.parentElement.addEventListener('mouseenter', function() {
            openItem(link);
            clearInterval(timer);
        });

        link.parentElement.addEventListener('mouseleave', function() {
            timer = setTimeout(function() {
                closeItem(link);
            }, 300);
        });

        link.addEventListener('touchend', function() {
            toggleItem(link);
        });

        link.addEventListener('keydown', function(event) {
            if (event.keyCode !== ENTER_KEY_CODE) return;
            toggleItem(link);
        });

        var menu = getMenuForItem(link);

        /**
         * По окончании анимации появления/скрытия  подменю, если оно должно быть скрыто, делаем его display: none, чтобы скрыть окончательно
         */
        menu.addEventListener('transitionend', function(event) {
            if (event.propertyName !== 'opacity') return;

            if (link.getAttribute('aria-expanded') === 'false') {
                menu.style.display = 'none';
            }            
        })
    });

    document.addEventListener('click', function(event) {
        closeNotTargetedItems(event.target);
    });

    document.addEventListener('keyup', function(event) {
        if (event.keyCode !== TAB_KEY_CODE) return;
        closeNotTargetedItems(event.target);
    });

    /**
     * Закрываем подменю по нажатию клавиши ESC
     */
    document.addEventListener('keydown', function(event) {
        if (event.keyCode !== ESC_KEY_CODE) return;
        closeNotTargetedItems(null);
    });

    /**
     * Скрыть пункты меню, которые не содержат внутри себя target
     * @param {*} target 
     */
    function closeNotTargetedItems(target) {
        [].forEach.call(links, function(link) {
            if (!link.parentElement.contains(target)) {
                closeItem(link);
            }
        })
    }

    /**
     * Получить подменю для пункта по ссылке
     * @param {*} link 
     */
    function getMenuForItem(link) {
        return link.nextElementSibling;
    }

    /**
     * Переключить расрытость пункта меню
     * @param {*} itemLink 
     */
    function toggleItem(itemLink) {
        if (itemLink.getAttribute('aria-expanded') === 'false') {
            openItem(itemLink);
        } else {
            closeItem(itemLink);
        }
    }

    /**
     * Раскрыть пункт меню
     * @param {*} itemLink 
     */
    function openItem(itemLink) {
        itemLink.setAttribute('aria-expanded', 'true');
        var menu = getMenuForItem(itemLink);

        /* Убираем display: none с подменю и следующим "тиком" убираем атрибут скрытости, чтобы подменю отобразилось с анимацией */
        menu.style.display = '';

        setTimeout(function(){
            menu.removeAttribute('aria-hidden');
        }, 0);       
    }

    /**
     * Скрыть подменю для пункта
     * @param {*} itemLink 
     */
    function closeItem(itemLink) {
        itemLink.setAttribute('aria-expanded', 'false');
        getMenuForItem(itemLink).setAttribute('aria-hidden', 'true');
    }
    
}

/* TODO: вынести это отсюда, если есть модульная сборка */
new Menu(document.querySelector('[data-role="menu"]'));
