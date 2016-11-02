var prefix = "ctl00_cphAllContext_";
//-------------------------------------------------------------------
//отключение выделения

//завершение
//-------------------------------------------------------------------     
function RecalculateCoordinate(idHF) {
    //функция перещитующая координаты
    prjbounds = map.getExtent();
    geo1 = OpenLayers.Layer.SphericalMercator.inverseMercator(prjbounds.left, prjbounds.top);
    geo2 = OpenLayers.Layer.SphericalMercator.inverseMercator(prjbounds.right, prjbounds.bottom);
    gl = geo1.lon;
    gt = geo1.lat;
    gr = geo2.lon;
    gb = geo2.lat;
    var hf = $(prefix + idHF);
    if (hf != null) {
        hf.value = gl + "#" + gt + "#" + gr + "#" + gb + "#" + map.getZoom();
    }
}

function OnChangeChecked(Id) {
    //функция выполняющаяся при изменении поиска "В точке"/"В карте"
    var divElement = $(prefix + "XYPoint");
    if (Id == "rbInPoint") {
        divElement.style.display = "block";
        if (marker != "undefined") {
            markLayer.removeMarker(marker)
        }
        ;
        var xE = $(prefix + "X");
        var yE = $(prefix + "Y");
        ax = xE.value;
        ay = yE.value;
        if (ax == "") {
            ax = 0;
            xE.value = "0"
        }
        ;
        if (ay == "") {
            ay = 0;
            yE.value = "0"
        }
        ;
        var geopoint = new OpenLayers.LonLat(ax, ay);
        prjpoint = OpenLayers.Layer.SphericalMercator.forwardMercator(geopoint.lon, geopoint.lat);
        marker = new OpenLayers.Marker(prjpoint, icon);
        markLayer.addMarker(marker);
    }
    else {
        divElement.style.display = "none";
        if (marker != null) {
            markLayer.removeMarker(marker)
        }
        ;
    }
}

function OnChangeXYCoordinate() {
    //функция выполняющаяся при смене значений координат
    var xElement = $(prefix + "X");
    var yElement = $(prefix + "Y");

    if (xElement != null && yElement != null) {
        ax = xElement.value;
        ay = yElement.value;
        if (ax == "") {
            ax = 0;
        }
        ;
        if (ay == "") {
            ay = 0;
        }
        ;
        var geopoint = new OpenLayers.LonLat(ax, ay);
        geopoint = OpenLayers.Layer.SphericalMercator.forwardMercator(geopoint.lon, geopoint.lat);
        if (marker != "undefined") {
            marker.lonlat = geopoint;
            markLayer.redraw();
        }
    }
}

function SetCurrentBorder(Id) {
    //Функция устанавливает подсветку текущего элемента в списке
    //Для нормального функционирования в элементе 'td' должен иметь класс item_cont_left. Класс элементу удовлетворяющему условия заменится на 'item_cont_left_cur'

    //Снять выделение с прошлого элемента
    var currentControl = getElementsByClassName('item_cont_left_cur', 'td');
    if (currentControl != null) {
        currentControl.className = 'item_cont_left';
    }

    //Выделить следующий
    var control = document.getElementById(Id);
    if (control != null) {
        var controls = control.getElementsByTagName('td');
        i = 0;
        while (i < controls.length) {
            if (controls[i].className == 'item_cont_left') {
                controls[i].className = 'item_cont_left_cur';
                i = controls.length;
            }
            i++;
        }
    }
}

function getElementsByClassName(needle, tagName) {
    // функция находит элемент который подходит по классу и тегу
    var my_array = document.getElementsByTagName(tagName);
    var retvalue = new Array();
    var i;

    for (i = 0; i < my_array.length; i++) {
        if (my_array[i].className == needle)
            return my_array[i];
    }
    return null;
}

function GetCoordinate() {
    //Расчет системы координат            
    var w = 405; // ширина окна  
    var h = 300; //высота окна  

    var wc = parseInt((screen.availWidth - w) / 2);
    var hc = parseInt((screen.availHeight - h) / 2);
    window.open("RecalculateCoordinate.aspx", null, "top=" + hc + ",screenY=" + hc + ",left=" + wc + ",screenX=" + wc +
        ",alwaysRaised=yes,dependent=yes,height=" + h + ",width=" + w +
        ",location=no,menubar=no,resizable=yes,toolbar=no,status=no");
}

function raisePopupTransformCoordinateEvent(data) {
    //Переложить систему координат
    var xElement = $(prefix + "X");
    var yElement = $(prefix + "Y");

    if (xElement != null && yElement != null) {
        var elemData = data.split(',');
        xElement.value = elemData[0];
        yElement.value = elemData[1];
        OnChangeXYCoordinate();
        GotoPoint();
    }
}

var Q_event = {
    target: function (e) {
        // for Mozilla/Internet Explorer
        if (e.target) return e.target;
        else if (e.srcElement) return e.srcElement;
    }
    , add: function (objct, type, fnctn) {
        // for Mozilla/Internet Explorer
        if (objct.addEventListener) {
            objct.addEventListener(type, fnctn, false);
            return true;
        } else if (objct.attachEvent) {
            var rtrn = objct.attachEvent('on' + type, fnctn);
            return rtrn;
        } else {
            objct.onclick = fnctn; //objct['on'+type] = fnctn;
        }
    }
    , remove: function (objct, type, fnctn) {
        // for Mozilla/Internet Explorer
        if (objct.removeEventListener) {
            objct.removeEventListener(type, fnctn, false);
            return true;
        } else if (objct.detachEvent) {
            var rtrn = objct.detachEvent('on' + type, fnctn);
            return rtrn;
        } else {
            objct.onclick = null; //objct['on'+type] = null;
        }
    }
};

var Q_drag = {
    optn: null //resize_x остальные пока не нужны и поэтому отключены |resize_y|resize_a
    , s_clntX: null
    , x_lmt: null
    , left_w: null
    , splitter_w: null
    , right_w: null
    , left_min: null
    , right_min: null
    , dragstart: function () {
        return false;
    }
    , mousemove: function (e) {
        // for Internet Explorer
        if (!e) e = window.event;
        var delta_x = e.clientX - Q_drag.s_clntX;
        if (Q_drag.optn == 'resize_x') {
            var frst_x = Q_drag.left_w + delta_x;
            if (0 < frst_x && frst_x < Q_drag.x_lmt) {
                document.getElementById('i_div_1').style.width = Math.max(Q_drag.left_w + delta_x, Q_drag.left_min) + 'px';
                document.getElementById('i_div_3').style.width = "100%";
                //Этот сплиттер не работает в опере. Двигается только вправо, но не влево
                //Хотя координаты считает правильно и присваивает ширину в style.width тоже правильно
                window.status = "div1: " + document.getElementById('i_div_1').style.width;
            }
        }
    }
    , mouseup: function (e) {
        Q_event.remove(document, 'mousemove', Q_drag.mousemove);
        Q_event.remove(document, 'mouseup', Q_drag.mouseup);
    }
    , extractWidth: function (element) {
        if (typeof window.getComputedStyle != 'undefined') {
            var style = window.getComputedStyle(element, '');
            if ((style.width.indexOf('%') >= 0) || isNaN(parseInt(style.width))) {
                element.style.width = element.clientWidth + 'px';
            }
            return parseInt(style.width);
        }
        if ((element.style.width.indexOf('%') >= 0) || isNaN(parseInt(element.style.width))) {
            element.style.width = element.clientWidth + 'px';
        }
        return parseInt(element.style.width);
    }
    , extractHeight: function (element) {
        if ((element.style.height.indexOf('%') >= 0) || isNaN(parseInt(element.style.height))) {
            element.style.height = element.clientHeight + 'px';
        }
        return parseInt(element.style.height);
    }
    , start: function (e, optn, l_min, r_min) {
        Q_drag.optn = optn;
        Q_drag.s_clntX = e.clientX;
        Q_drag.left_min = l_min;
        Q_drag.right_min = r_min;
        Q_drag.splitter_w = Q_drag.extractWidth(document.getElementById('i_div_2'));
        Q_drag.x_lmt = document.getElementById('i_tbl').clientWidth;

        Q_drag.left_w = Math.max(Q_drag.s_clntX, Q_drag.left_min);
        Q_drag.right_w = Math.max(Q_drag.x_lmt - Q_drag.left_w - Q_drag.splitter_w, Q_drag.right_min);

        // for Internet Explorer
        if (e.srcElement) Q_event.add(e.srcElement, 'dragstart', Q_drag.dragstart);
        Q_event.add(document, 'mousemove', Q_drag.mousemove);
        Q_event.add(document, 'mouseup', Q_drag.mouseup);
    }
};
//*****************************************************************************
//скрипты, относящиеся к подвижному окну результатов поиска
var startWindowWidth = 0;
var startWindowHeight = 0;
//---------------------------------------------------------------------
//привязка обработчика callback к событию eventName элемента element
function hookEvent(element, eventName, callback) {
    if (typeof (element) == "string")
        element = document.getElementById(element);
    if (element == null)
        return;
    if (element.addEventListener)
        element.addEventListener(eventName, callback, false);
    else if (element.attachEvent)
        element.attachEvent("on" + eventName, callback);
}
//---------------------------------------------------------------------
//отвязывание обработчика callback к событию eventName элемента element
function unhookEvent(element, eventName, callback) {
    if (typeof (element) == "string")
        element = document.getElementById(element);
    if (element == null)
        return;
    if (element.removeEventListener)
        element.removeEventListener(eventName, callback, false);
    else if (element.detachEvent)
        element.detachEvent("on" + eventName, callback);
}
//---------------------------------------------------------------------
//прекращение выполнения обработчиков данного события
function cancelEvent(e) {
    e = e ? e : window.event;
    if (e.stopPropagation)
        e.stopPropagation();
    if (e.preventDefault)
        e.preventDefault();
    e.cancelBubble = true;
    e.cancel = true;
    e.returnValue = false;
    return false;
}
//---------------------------------------------------------------------

//=====================================================================
//объект - позиция
function Position(x, y) {
    this.X = x;
    this.Y = y;
    //.................................................................
    //сложение координат
    this.Add = function (val) {
        var newPos = new Position(this.X, this.Y);
        if (val != null) {
            if (!isNaN(val.X))
                newPos.X += val.X;
            if (!isNaN(val.Y))
                newPos.Y += val.Y
        }
        return newPos;
    }
    //.................................................................
    //вычитание координат
    this.Subtract = function (val) {
        var newPos = new Position(this.X, this.Y);
        if (val != null) {
            if (!isNaN(val.X))
                newPos.X -= val.X;
            if (!isNaN(val.Y))
                newPos.Y -= val.Y
        }
        return newPos;
    }
    //.................................................................
    //получение точки с минимальными координатами
    this.Min = function (val) {
        var newPos = new Position(this.X, this.Y)
        if (val == null)
            return newPos;

        if (!isNaN(val.X) && this.X > val.X)
            newPos.X = val.X;
        if (!isNaN(val.Y) && this.Y > val.Y)
            newPos.Y = val.Y;

        return newPos;
    }
    //.................................................................
    //получение точки с максимальными координатами
    this.Max = function (val) {
        var newPos = new Position(this.X, this.Y)
        if (val == null)
            return newPos;

        if (!isNaN(val.X) && this.X < val.X)
            newPos.X = val.X;
        if (!isNaN(val.Y) && this.Y < val.Y)
            newPos.Y = val.Y;

        return newPos;
    }
    //.................................................................
    //запрещает положению покидать границы
    this.Bound = function (lower, upper) {
        var newPos = this.Max(lower);
        return newPos.Min(upper);
    }
    //.................................................................
    //проверка положения
    this.Check = function () {
        var newPos = new Position(this.X, this.Y);
        if (isNaN(newPos.X))
            newPos.X = 0;
        if (isNaN(newPos.Y))
            newPos.Y = 0;
        return newPos;
    }
    //.................................................................
    //применение положения к заданному элементу
    this.Apply = function (element) {
        if (typeof (element) == "string")
            element = document.getElementById(element);
        if (element == null)
            return;
        if (!isNaN(this.X))
            element.style.left = this.X + 'px';
        if (!isNaN(this.Y))
            element.style.top = this.Y + 'px';
    }
}
//=====================================================================

//---------------------------------------------------------------------
//возвращает текущее положение курсора
function absoluteCursorPosition(eventObj) {
    eventObj = eventObj ? eventObj : window.event;

    if (isNaN(window.scrollX))
        return new Position(eventObj.clientX + document.documentElement.scrollLeft
            + document.body.scrollLeft,
            eventObj.clientY + document.documentElement.scrollTop
            + document.body.scrollTop);
    else
        return new Position(eventObj.clientX + window.scrollX,
            eventObj.clientY + window.scrollY);
}
//---------------------------------------------------------------------

//=====================================================================
//класс - перемещаяемый объект
function dragObject(element, attachElement, lowerBound, upperBound,
                    startCallback, moveCallback, endCallback, attachLater) {
    if (typeof (element) == "string")
        element = document.getElementById(element);

    if (element == null)
        return;

    if (lowerBound != null && upperBound != null) {
        var temp = lowerBound.Min(upperBound);
        upperBound = lowerBound.Max(upperBound);
        lowerBound = temp;
    }

    var cursorStartPos = null;
    var elementStartPos = null;
    var dragging = false;
    var listening = false;
    var disposed = false;
    this.IsDragging = function () {
        return dragging;
    }
    this.IsListening = function () {
        return listening;
    }
    this.IsDisposed = function () {
        return disposed;
    }

    if (typeof (attachElement) == "string")
        attachElement = document.getElementById(attachElement);
    if (attachElement == null)
        attachElement = element;

    //.................................................................
    //начало движения
    function dragStart(eventObj) {
        if (dragging || !listening || disposed)
            return;

        dragging = true;

        if (startCallback != null)
            startCallback(eventObj, element);

        cursorStartPos = absoluteCursorPosition(eventObj);

        elementStartPos = new Position(parseInt(element.style.left),
            parseInt(element.style.top));

        elementStartPos = elementStartPos.Check();

        hookEvent(document, "mousemove", dragGo);
        hookEvent(document, "mouseup", dragStopHook);

        return cancelEvent(eventObj);
    }

    //.................................................................
    //выполнение движения
    function dragGo(eventObj) {
        if (!dragging || disposed)
            return;

        var newPos = absoluteCursorPosition(eventObj);
        newPos = newPos.Add(elementStartPos).Subtract(cursorStartPos);
        newPos = newPos.Bound(lowerBound, upperBound)
        newPos.Apply(element);
        if (moveCallback != null)
            moveCallback(newPos, element);

        return cancelEvent(eventObj);
    }

    //.................................................................
    //выполнение остановки перетаскивания
    function dragStopHook(eventObj) {
        dragStop();
        return cancelEvent(eventObj);
    }

    //.................................................................
    //остановка перетаскивания
    function dragStop() {
        if (!dragging || disposed)
            return;

        unhookEvent(document, "mousemove", dragGo);
        unhookEvent(document, "mouseup", dragStopHook);
        cursorStartPos = null;
        elementStartPos = null;
        if (endCallback != null)
            endCallback(element);
        dragging = false;
    }

    //.................................................................        
    //очистка переменных
    this.Dispose = function () {
        if (disposed)
            return;

        this.StopListening(true);
        element = null;
        attachElement = null
        lowerBound = null;
        upperBound = null;
        startCallback = null;
        moveCallback = null
        endCallback = null;
        disposed = true;
    }
    //.................................................................   
    //начало обработки передвижений     
    this.StartListening = function () {
        if (listening || disposed)
            return;

        listening = true;
        hookEvent(attachElement, "mousedown", dragStart);
    }
    //.................................................................
    //прекращение обработки передвижений     
    this.StopListening = function (stopCurrentDragging) {
        if (!listening || disposed)
            return;

        unhookEvent(attachElement, "mousedown", dragStart);
        listening = false;

        if (stopCurrentDragging && dragging)
            dragStop();
    }
    //.................................................................

    if (!attachLater)
        this.StartListening();
}
//=====================================================================
var GimgWindowCorner = null;
var GdivWindow = null;
var GmasterBody = null;
var GdivWindowBody = null;
var GdivWindowHeader = null;
var GdivWindowFooter = null;
var GdivProgressImage = null;
var GdragDivWindow = null;
var GdragImgCorner = null;
var GdragMinimizedWindow = null;
var GdivMaximizeButton = null;
var GdivMinimizeButton = null;

var GOldWidth = 0;
var GOldHeight = 0;
var GOldTop = 0;
var GOldLeft = 0;
var GWindowMinimized = false;
//---------------------------------------------------------------------
//выставление высоты
function DoHeight(y, element) {

    if (startWindowHeight + y > 100) {
        GdivWindow.style.height = startWindowHeight + y + 'px';
        GdivWindowBody.style.height = startWindowHeight + y - 39 + 'px';
    }
}
//---------------------------------------------------------------------
//выставление ширины
function DoWidth(x, element) {
    if (startWindowWidth + x > 250) {
        GdivWindow.style.width = startWindowWidth + x + 'px';
        GdivWindowHeader.style.width = startWindowWidth + x + 'px';
    }
}
//---------------------------------------------------------------------
//обработчик движения угла
function CornerMove(newPos, element) {
    DoHeight(newPos.Y, element);
    DoWidth(newPos.X, element);
}
//---------------------------------------------------------------------
//для инициализации окна результатов поиска при загрузке окна
Sys.Application.add_init(AppInit);

function AppInit() {
    Sys.Application.add_load(OnDocumentLoad);
}
//установка начального вида окна результатов поиска
function OnDocumentLoad() {
    GdivWindow = document.getElementById('divWindow');
    GdivWindowHeader = document.getElementById('divWindowHeader');
    GdivWindowBody = document.getElementById('divWindowBody');
    GdivWindowFooter = document.getElementById('divWindowFooter');
    GimgWindowCorner = document.getElementById('imgWindowCorner');
    GdivProgressImage = document.getElementById('divProgressImgBar');
    GmasterBody = document.getElementById('masterBody');
    GdivMaximizeButton = document.getElementById('divMaximizeButton');
    ;
    GdivMinimizeButton = document.getElementById('divMinimizeButton');
    ;

    GdragDivWindow = new dragObject(GdivWindow, GdivWindowHeader, null, null, null, null, null, null); //инициализируем передвигаемые объекты
    GdragImgCorner = new dragObject(GimgWindowCorner, null, null, null, null, CornerMove, null, false);

    if (startWindowWidth == 0) //задаем начальные размеры окна
        startWindowWidth = parseInt(GdivWindow.style.width);
    if (startWindowHeight == 0)
        startWindowHeight = parseInt(GdivWindow.style.height);

    GmasterBody.style.cursor = 'default'; //выставляем курсор по-умолчанию (в т.ч. после завершения поиска)
    GdivProgressImage.style.visibility = 'hidden';
    GdivProgressImage.style.display = 'none';
}
//********************************************************************

window.onresize = OnWindowResize;
//-----------------------------------------------------------------------------
//изменение размеров окна
function OnWindowResize() {
    if (GWindowMinimized) {
        GdragMinimizedWindow.Dispose();
        GdragMinimizedWindow = null;
        SetMinimizedWindowStartPosition();
        GdragMinimizedWindow = new dragObject(GdivWindow, null, null, null, null, null, null, null);
    }
}
//-----------------------------------------------------------------------------
function SetMinimizedWindowStartPosition() {
    GdivWindow.style.left = '15px';
    var clientHeight = getClientHeight();
    GdivWindow.style.top = clientHeight - 45 + 'px';
}
//-----------------------------------------------------------------------------
//function getClientWidth() {
//return document.compatMode == 'CSS1Compat' && !window.opera ? document.documentElement.clientWidth : document.body.clientWidth;
//}

function getClientHeight() {
    return document.compatMode == 'CSS1Compat' && !window.opera ? document.documentElement.clientHeight : document.body.clientHeight;
}
//-----------------------------------------------------------------------------
//выставляет курсор на странице в песочные часы либо по-умолчанию
function ProcessSearchStart() {
    GmasterBody.style.cursor = "wait";
    GdivProgressImage.style.visibility = "visible";
    GdivProgressImage.style.display = "inline";
}
//-----------------------------------------------------------------------------
//разворачивание окна
function OnMaximizeClick() {
    GdragMinimizedWindow.Dispose();
    GdragMinimizedWindow = null;

    GdivWindow.style.height = GOldHeight;
    GdivWindow.style.width = GOldWidth;
    GdivWindowHeader.style.width = GOldWidth;
    GdivWindow.style.top = GOldTop;
    GdivWindow.style.left = GOldLeft;

    GdivWindowBody.style.visibility = 'visible';
    GdivWindowFooter.style.visibility = 'visible';

    GdragDivWindow = new dragObject(GdivWindow, GdivWindowHeader, null, null, null, null, null, null); //инициализируем передвигаемые объекты
    GdragImgCorner = new dragObject(GimgWindowCorner, null, null, null, null, CornerMove, null, false);

    GdivMaximizeButton.style.visibility = 'hidden';
    GdivMinimizeButton.style.visibility = 'visible';
    GdivMinimizeButton.style.display = '';

    GWindowMinimized = false;
}
//-----------------------------------------------------------------------------
//сворачивание окна
function OnMinimizeClick() {
    GOldHeight = GdivWindow.style.height;
    GOldWidth = GdivWindow.style.width;
    GOldTop = GdivWindow.style.top;
    GOldLeft = GdivWindow.style.left;

    GdragDivWindow.Dispose();
    GdragDivWindow = null;
    GdragImgCorner.Dispose();
    GdragImgCorner = null;

    GdivWindowBody.style.visibility = 'hidden';
    GdivWindowFooter.style.visibility = 'hidden';

    GdivWindow.style.height = '25px';
    GdivWindow.style.width = '250px';
    GdivWindowHeader.style.width = '250px';
    SetMinimizedWindowStartPosition();

    GdragMinimizedWindow = new dragObject(GdivWindow, null, null, null, null, null, null, null);
    GdivMaximizeButton.style.visibility = 'visible';
    GdivMinimizeButton.style.visibility = 'hidden';
    GdivMinimizeButton.style.display = 'none';

    GWindowMinimized = true;
}
//-----------------------------------------------------------------------------
