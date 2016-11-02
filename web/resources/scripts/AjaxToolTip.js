////////////////////////////////////////////////////////////////////////////////////////
//--                Скрипт отображает\скрывает панель краткого вида                 --//
//--                    Используется в Заявках, Нарядах, ОКС, ЗУ                    --//
////////////////////////////////////////////////////////////////////////////////////////

var xmlHttp;
var InfVisible = false;

//
function GetXmlHttpObject() {
    var objXMLHttp = null
    if (window.XMLHttpRequest)
        objXMLHttp = new XMLHttpRequest()
    else if (window.ActiveXObject)
        objXMLHttp = new ActiveXObject("Microsoft.XMLHTTP")
    return objXMLHttp
}

// При наступлении события показывает или скрывает информационную панель
function stateChanged() {

    if (xmlHttp == null) alert("xmlHttp is null");
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
        var txtHint = document.getElementById("txtHint");
        if (txtHint) {
            if (!InfVisible) {
//            if (txtHint.childNodes.length <= 0) {
                txtHint.innerHTML = xmlHttp.responseText;
                InfVisible = true;
            }
            else {
                txtHint.innerHTML = "";
                InfVisible = false;
            }
        }
    }
}

// Объект XMLHttp отсылает GET-запрос на сервер
function xmlHttp_Get(xmlhttp, url) {

    if (xmlHttp == null)
        alert("func xmlHttp_Get: xmlHttp is null");

    var txtHint = document.getElementById("txtHint"); //картинка, которая показывается до конца загрузки панели информации
    txtHint.innerHTML = "<img src=\"" + ("../../../Image/StatLoad.gif") + "\" alt=\"информация о документе в процессе загрузки\" />";
    //alert("ssss");

    xmlHttp.onreadystatechange = stateChanged;
    xmlhttp.open('GET', url, true);
    xmlhttp.send(null);
}

// Посылаем запрос на сервер на выбранный URL
function show_data(requestURL) {

    if (requestURL.length > 0) {
        var url = requestURL;

        // Создаем объект xmlHttp
        // При смене состояния объекта отрабатывает событие stateChangeHandler
        // Используется асинхронная модель
        xmlHttp = GetXmlHttpObject();

        if (xmlHttp == null) {
            alert("Браузер не поддерживает запросы HTTP");
            return;
        }
        xmlHttp_Get(xmlHttp, url);
    }
    else {
        document.write('info not found...');
    }
    //txtHint.txtHint.innerHTML = "END";
}     