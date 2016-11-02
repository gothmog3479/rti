var DelayDblClick = 400; //задержка для двойного нажатия в мс.
var DelayHold = 2000; //задержка для удержания нажатой

var DblClickPhase = 0; //0: исходная;  1: после 1-го нажатия; 2: после отпускания;
var KeyDblClick = 0;

var HoldPhase = 0; //0: исходная;  1: после нажатия; 2: после выполнения (до отпускания)
var KeyHold = 0;
var HoldTimerId = null;

var nav = CheckBrowser();

document.onkeydown = OnKeyDownHandler;
document.onkeyup = OnKeyUpHandler;
//-----------------------------------------------------------------------------
//проверка браузера
function CheckBrowser() {

    if (navigator.appName == 'Microsoft Internet Explorer') {
        return ('IE');
    }
    else {
        return ('NONE');
    }
}
//-----------------------------------------------------------------------------
//таймер для удержания нажатой кнопки
function HoldTimer() {

    if (HoldPhase == 1) { //если удержание в процессе
        DblClickPhase = 0;
        HoldPhase = 2;
        __doPostBack('lbPlayOrPause', '');
    }
}
//-----------------------------------------------------------------------------
//Таймер для двойного нажатия
function DblClickTimer() {

    DblClickPhase = 0;
}
//-----------------------------------------------------------------------------
//обработчик OnKeyPress
function OnKeyUpHandler(e) {

    HoldPhase = 0; //прерывание удержания
    clearTimeout(HoldTimerId);

    if (DblClickPhase == 1) //если в процессе двойного клика - переход к фазе 2
        DblClickPhase = 2;
}
//-----------------------------------------------------------------------------
//обработчик OnKeyPress
function OnKeyDownHandler(e) {

    var key;
    if (nav == 'IE') {
        var evt = window.event;
        key = evt.keyCode;
    }
    else {
        key = e.keyCode;
    }

    if (DblClickPhase == 2) { //если второе нажатие
        if (key == KeyDblClick) { //если на ту же конпку
            DblClickPhase = 0;
            HoldPhase = 0;
            if (key == 33)
                __doPostBack('lbNext', '');
            if (key == 34)
                __doPostBack('lbBack', '');
        }
        else { //если на другую кнопку
            DblClickPhase = 0;
        }
    }
    else { //если первое нажатие
        if (HoldPhase == 0) { //если не повторное удержание (фаза 2)
            HoldPhase = 1;
            KeyHold = key;
            HoldTimerId = setTimeout("HoldTimer()", DelayHold);
        }
        if (DblClickPhase == 0) { //если первое нажатие
            DblClickPhase = 1;
            KeyDblClick = key;
            setTimeout("DblClickTimer()", DelayDblClick);
        }
    }
}
//-----------------------------------------------------------------------------

