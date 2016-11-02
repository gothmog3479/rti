////////////////////////////////////////////////////////////////////////////////////////
//--                            Скрипт загрузки статистики                          --//
//--                    Используется на дефолтовой странице сайта                   --//
////////////////////////////////////////////////////////////////////////////////////////

function GetXmlHttpObject() {
    var objXMLHttp = null;

    if (window.ActiveXObject) {
        objXMLHttp = new ActiveXObject("Msxml2.XMLHTTP");
        if (!objXMLHttp) objXMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if (window.XMLHttpRequest) objXMLHttp = new XMLHttpRequest();
    return objXMLHttp;
}

// При наступлении события загружает статистику
function stateChanged(xmlHttp, elemID) {
    if (xmlHttp == null) alert("xmlHttp is null");

    if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
        var tdElem = document.getElementById(elemID);
        if (tdElem) {
            tdElem.innerHTML = xmlHttp.responseText;
        }
    }
}

// Объект XMLHttp отсылает GET-запрос на сервер
function xmlHttp_Get(xmlHttp, url, elemID) {
    if (xmlHttp == null) alert("func xmlHttp_Get: xmlHttp is null");

    xmlHttp.onreadystatechange = function (e) {
        var ee = e;
        stateChanged(xmlHttp, elemID);
    };
    xmlHttp.open('GET', url, true);
    xmlHttp.send(null);
}

// Ищем контрол по ClientID
function new_find(name) {
    var elems = document.getElementsByTagName('*');
    var num = elems.length;
    for (var c = 0; c < num; c++) {
        var val = elems[c].getAttribute('ClientID');
        if (val != null && val == name)
            return elems[c];
    }
}

// Посылаем запрос на сервер на выбранный URL
function show_data(requestURL, idControl) {
    var elem = new_find(idControl);

    if (requestURL.length > 0) {
        var url = requestURL + "&random=" + Math.random();

        // Создаем объект xmlHttp
        // При смене состояния объекта отрабатывает событие stateChangeHandler
        // Используется асинхронная модель
        var xmlHttp = GetXmlHttpObject();

        if (xmlHttp == null) {
            alert("Браузер не поддерживает запросы HTTP");
            return;
        }

        xmlHttp_Get(xmlHttp, url, elem.id);
    }
    else {
        document.write('info not found...');
    }
}  