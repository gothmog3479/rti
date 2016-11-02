//Добавляет обработчик к событию
function tiAddHandler(object, event, handler) {
    if (typeof object.addEventListener != 'undefined')
        object.addEventListener(event, handler, false);
    else if (typeof object.attachEvent != 'undefined')
        object.attachEvent('on' + event, handler);
    else
        throw "Incompatible browser";
}

//Убирает обработчик события
function tiRemoveHandler(object, event, handler) {
    if (typeof object.removeEventListener != 'undefined')
        object.removeEventListener(event, handler, false);
    else if (typeof object.detachEvent != 'undefined')
        object.detachEvent('on' + event, handler);
    else
        throw "Incompatible browser";
}

function tiShowProgressIndicator(sender, args) {
    document.body.style.cursor = "wait";
}

function tiHideProgressIndicator(sender, args) {
    document.body.style.cursor = "auto";
}

function tiAddProgressIndicatorHandlers() {
    Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(tiShowProgressIndicator);
    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(tiHideProgressIndicator);
}

function client_OnTreeNodeChecked() {
    var obj = window.event.srcElement;
    var treeNodeFound = false;
    var checkedState;
    if (obj.tagName == "INPUT" && obj.type == "checkbox") {
        var treeNode = obj;
        checkedState = treeNode.checked;
        do
        {
            obj = obj.parentElement;
        }
        while (obj.tagName != "TABLE")
        var parentTreeLevel = obj.rows[0].cells.length;
        var parentTreeNode = obj.rows[0].cells[0];
        var tables = obj.parentElement.getElementsByTagName("TABLE");
        var numTables = tables.length;
        if (numTables >= 1) {
            for (i = 0; i < numTables; i++) {
                if (tables[i] == obj) {
                    treeNodeFound = true;
                    i++;
                    if (i == numTables) {
                        return;
                    }
                }
                if (treeNodeFound == true) {
                    var childTreeLevel = tables[i].rows[0].cells.length;
                    if (childTreeLevel > parentTreeLevel) {
                        var cell = tables[i].rows[0].cells[childTreeLevel - 1];
                        var inputs = cell.getElementsByTagName("INPUT");
                        inputs[0].checked = checkedState;
                    }
                    else {
                        return;
                    }
                }
            }
        }
    }
}