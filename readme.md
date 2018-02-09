# Разработка доступного меню сайта

Каждый frontend разработчик сталкивается с необходимостью практической реализации меню сайта с выпадающим подменю. В интернете на сегодняшний момент полно руководств на любой вкус: только на CSS, на JS с jQuery и без jQuery, вертикальное и горизонтальное меню и т.п.

Большинство реализаций, как правило, решает задачу наиболее очевидным способом - отобразить подменю при наведении курсора мыши на его пункт. Реализация верная по, как минимум, следующим параметрам: так сложился пользовательский опыт и люди привыкли, часто решается исключительно средствами CSS, поэтому просто в реализации. Однако подобные решения нельзя назвать на 100% эффективными, ведь существуют категории пользователей, физически не способные воспользоваться подобным решением. Я говорю о пользователях:
* с нарушениями опорно-двигательного аппарата, которые не могут работать мышью или делают это с довольно низкой точностью;
* с нарушением зрения или его полным отсутствием, которые для серфинга в интернете вынуждены прибегать к помощи сторонних программных средств, таких как экранные чтецы, озвучивающие содержимое страницы;
* использующих сенсорные устройства. Многие современные интерфейсы веб страниц не адаптированы под подобную категории устройств. Речь не о мобильных устройствах (для которых уже даже рядовой верстальщик научился делать адаптивную верстку), а о планшетах, ноутбуках, моноблоках, информационных стендов и прочих устройств с сенсорными экранами, вынужденных отображать интерфейс, заточенный под мышь, но таковую часто не имеющие.

Ниже я изложу свою реализацию меню, учитывающую эти особенности.

Рекомендую дополнительно ознакомиться с:
* https://www.w3.org/TR/wai-aria
* https://www.w3.org/TR/WCAG21/

## Требования к меню

Разработку начну с предъявления требований нашему будущему меню. В статье не буду делать крайне универсального решения на каждую ситуацию, просто условимся что:
* Некоторые пункты содержат выпадающее подменю.
* Подменю отображается при наведении курсора мыши на соответствующий пункт меню.
* Подменю отображается нажатием клавиши Enter, когда пункт меню в фокусе
* Подменю отображается касанием пункта меню на сенсорном устройстве.
* Меню доступно для работы с клавиатуры. При этом если подменю не раскрыто, то фокус в него не попадает, а переходит к следующему пункту меню. Если подменю раскрыто, то его элементы доступны для навигации с клавиатуры.
* Когда фокус при работе с клавиатуры уходит с пункта меню или подменю на другие пункты, то подменю закрывается.
* Клик вне области пункта меню закрывает подменю.
* Экранные читалки озвучивают состояние пункта меню (раскрыт или закрыт) и игнорируют контент скрытого подменю.

## Структура верстки

Добавим структуру верстки, в которой один из пунктов сделаем с подменю. Я не рекомендую делать ссылками те пункты, для которых будет отображаться подменю, так как в этом случае вы будете вынуждены обеспечивать одновременно переход по ссылке и раскрытие подменю при работе с клавиатуры и сенсорными устройствами. Добавьте эту ссылку как первую в подменю - и ссылку не потеряете и доступность сохраните.

Первоначальная верстка выглядит следующим образом:
```html
<nav aria-label="Основное меню сайта">
   <ul class="menu" role="menubar" data-role="menu">
       <li>
           <a href="#link-1" role="menuitem">Ссылка 1</a>
       </li>
       <li>
           <a href="#link-2" aria-current="page" role="menuitem">Ссылка 2</a>
       </li>
       <li>
           <span aria-haspopup="true"
                 aria-expanded="false"
                 role="menuitem"
                 aria-controls="submenu-1"
                 tabindex="0">
               Пункт с выпадающим меню
           </span>
           <ul role="menu" id="submenu-1">
               <li>
                   <a href="#1" role="menuitem">Подменю 1</a>
               </li>
               <li>
                   <a href="#2" role="menuitem">Подменю 2</a>
               </li>
               <li>
                   <a href="#3" role="menuitem">Подменю 3</a>
               </li>
           </ul>
       </li>
       <li>
           <a href="#link-3" role="menuitem">Ссылка 3</a>
       </li>
   </ul>
</nav>
```

Моменты, на которые стоит обратить внимание:
* Навигацию заворачиваем тегом nav и озаглавливаем с помощью атрибута aria-label. Пользователи, использующие экранные читалки, смогут быстро попадать в раздел меню с помощью горячих клавиш и, прослушав содержимое атрибута aria-label, понять его назначение. Если на странице больше одного меню, пользователь сможет легко их различать.
* Списки меню имеют роль role=”menu”. Подробнее о ролях элементов сайта можно ознакомиться тут https://www.w3.org/TR/wai-aria/#menu. Не используйте для меню сайта роль menubar, так как эта роль предназначена для меню web приложений, имеющего назначение схожее с привычными десктопными программами, например, панель инструментов.
* Элементы меню имеют атрибут role=”menuitem”. Атрибут расставляется непосредственно для элементов, с которыми пользователь взаимодействует.
* Ели порядок пунктов меню важен, то используйте тег OL, если не важен, то UL
* Пункт с выпадающим меню получил атрибуты:
    * aria-haspopup=”true” - Указывает экранным чтецам, что на странице присутствует скрытый контент, отображение которого переключается элементом с этим атрибутом
    * aria-expanded=”false” - Указывает экранным чтецам, раскрыт или скрыт выпадающий контент
    * aria-controls=”<id>” - идентификатор контролируемого блока
* Подменю обзавелось атрибутом id для связывания с контролирующим пунктом меню.
* Атрибут aria-current=”page” у ссылки подсказывает экранным чтецам, что ссылка ведет на текущую страницу, что дополнительно озвучивается пользователю для предотвращения лишнего перехода.

## Написание стилей

Атрибуты aria-* помогают не только расставить акценты для экранных чтецов, но и отчасти облегчают написание стилей. Теперь не нужен специальный класс для элемента с выпадающим меню, можете просто использовать наличие атрибута aria-haspopup. Появление и скрытие подменю привязывается к значению атрибута aria-expanded у пункта меню. 

Например, для скрытия подменю используются следующие стили:

```css
.menu [aria-expanded="false"] + [role="menu"] {
   display: none;
}
```

## Обработка взаимодействия с меню мышью

Для интерпретации экранными чтецами состояния пункта меню (скрыт или закрыт) необходимо менять значение атрибута aria-expanded. Контролировать состояние будем через JavaScript, поэтому решить задачу только средствами CSS не получится.

Создадим класс, в котором будет список ссылок и методы: открыть элемент, скрыть элемент и переключить видимость элемента. Аргументом методов будет ссылка пункта меню.

```javascript
function Menu(container) {
   const root = container;
   const links = root.querySelectorAll('[aria-haspopup="true"]');

   function toggleItem(itemLink) {
       if (itemLink.getAttribute('aria-expanded') === 'false') {
           openItem(itemLink);
       } else {
           closeItem(itemLink);
       }
   }

   function openItem(itemLink) {
       itemLink.setAttribute('aria-expanded', 'true');
   }

   function closeItem(itemLink) {
       itemLink.setAttribute('aria-expanded', 'false');
   }
}

/* Создаем экземпляр меню */
new Menu(document.querySelector('[data-role="menu"]'));
```

Теперь у нас есть методы для смены состояния меню и написаны стили. Стили компонента меню приводить не буду, так как они индивидуальны для каждого проекта.

Добавим смену состояния пункта меню при hover эффектах мыши с помощью событий mouseenter и mouseleave. Обратите внимание, что события будем отлавливать не на элементах role=”menuitem”, а на элементах списка (элементах li), ведь важно сохранять состояние когда курсор мыши наведен и на подменю пункта.
```javascript
[].forEach.call(links, function(link) {
   link.parentElement.addEventListener('mouseenter', function(event) {
       openItem(link);
   });

   link.parentElement.addEventListener('mouseleave', function(event) {
       closeItem(link);
   })
});
```

Теперь меню раскрывается, если навести курсор мыши на элемент. Что делать, если точность работы мышью у пользователя низкая или по дизайну между пунктом и подменю пустое пространство? Пользователь может случайно увести курсор, двигая его на подменю, или попасть в пустое пространство - в этом случае меню закроется.

Нет универсального решения проблемы. Можно решить задачу путем дизайна, когда стили элементов и списка будут широкими и без пустого пространства между ними, минимизировав промахи. Решим задачу добавив короткую задержку скрытия, дав пользователю неявную возможность успеть вернуть курсор на элемент. 

Добавим скрытие меню с задержкой 0.3 секунды, что позволит избежать закрытия при коротких случайных уводах курсора. 

```javascript
[].forEach.call(links, function(link) {
       let timer;

       link.parentElement.addEventListener('mouseenter', function(event) {
           openItem(link);
           clearInterval(timer);
       });

       link.parentElement.addEventListener('mouseleave', function(event) {
           timer = setTimeout(function() {
               closeItem(link);
           }, 300);
       });
});
```


## Адаптация меню для работы с клавиатуры и сенсорных устройств

Теперь предусмотрим отзывчивость меню при работе с клавиатуры и устройств с сенсорным экраном. 

Добавим обработчик нажатия клавиши Enter по пункту меню в фокусе, который будет переключать отображение меню.

```javascript
var ENTER_KEY_CODE = 13;

link.addEventListener('keydown', function(event) {
     if (event.keyCode !== ENTER_KEY_CODE) return;
     toggleItem(link);
});
```


Для сенсорных устройств подпишемся на событие touchend, а не на событие click, так как последний в нашем случае сначала вызовет событие mouseenter и пункт меню при первом взаимодействии раскроется (mouseenter) и тут же закроется (сработает клик).

```javascript
link.addEventListener('touchend', function(event) {
     toggleItem(link);
});

```

## Реализация дополнительных возможностей

Теперь нужно при клике вне пункта меню и при уходе фокуса закрывать подменю. Для этого добавим подписку на события “click” и “keyup” на document и будем проверять event.target на принадлежность меню. Если элемент, с которым взаимодействуем, находится вне пункта меню, то будем закрывать подменю.

```javascript
var TAB_KEY_CODE = 9;

document.addEventListener('click', function (event) {
   closeNotTargetedItems(event.target);
});

document.addEventListener('keyup', function (event) {
   if (event.keyCode !== TAB_KEY_CODE) return;
   closeNotTargetedItems(event.target);
});

function closeNotTargetedItems(target) {
   [].forEach.call(links, function (link) {
       if (!link.parentElement.contains(target)) {
           closeItem(link);
       }
   })
}
```


## Результаты и дальнейшее развитие

Демо меню доступно по ссылке https://mixrich.github.io/wcag-menu/

В демо представлено развитие функциональности, когда подменю открывается и закрывается с анимацией. Так же этот код представлен с комментариями.

Для дальнейшего развития функциональности меню рекомендую ознакомиться с практиками WAI-ARIA https://www.w3.org/TR/wai-aria-practices-1.1/#menu/, в которых представлен весь перечень клавиш клавиатуры и ожидаемые реакции на их нажатие.

