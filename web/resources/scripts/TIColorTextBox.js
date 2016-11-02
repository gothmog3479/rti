//Change color palette script
function SetColor(inputTextId) {
    var prefix = inputTextId.substr(0, inputTextId.lastIndexOf('_') + 1);
    var objectElement = document.getElementById(prefix + "divControl");
    var inputTextElement = document.getElementById(inputTextId);
    if (objectElement != null && inputTextElement != null) {
        var oldBackgroundColor = objectElement.style.backgroundColor;
        try {
            objectElement.style.backgroundColor = inputTextElement.value;
        }
        catch (e) {
            objectElement.style.backgroundColor = oldBackgroundColor;
        }
    }
}

// конструктор
Colors = function (objectId, inputTextId, styleColor, pallete) {
    this._object = document.getElementById(objectId);
    this._objectId = objectId;
    this.inputText = document.getElementById(inputTextId);
    this.inputTextId = inputTextId;
    this.styleColor = styleColor;
    eval('this.oldColor = Colors.rgb2hex(this._object.style.' + styleColor + ')');
    this.inputText.value = this.oldColor;
    this.pallete = pallete;
}

// рисуем палитру
Colors.prototype.show = function () {
    this.allwidth = this.allwidth - (this.cols * 2 - 2);
    this.allheight = this.allheight - (this.rows * 2 - 2);
    var table = '<span id="allcolorselementsselect' + this.inputTextId + '" onclick="Colors.SetVisible(\'' + this.inputTextId + '\',' + this.allwidth + ',' + this.allheight + ')" style="cursor: pointer;"><img id="image' + this.inputTextId + '" src="' + this.outImage + '" title="Выбрать цвет из палитры" width="18px;" height="18px;" style="position:relative; " onmouseover="this.src=\'' + this.overImage + '\'" onmouseout="this.src=\'' + this.outImage + '\'" /></span>';
    table += '<input id="setc' + this.inputTextId + '" type="hidden" value="0" />';
    table += '<input id="oldColor' + this.inputTextId + '" type="hidden" value="#' + this.oldColor + '" />';
    table += '<a id="allcolorselementslink' + this.inputTextId + '" href="#" onclick="return false;" onblur="document.getElementById(\'allcolorselements' + this.inputTextId + '\').style.display=\'none\'; if (document.getElementById(\'setc' + this.inputTextId + '\').value!=\'1\') Colors.changecolor(document.getElementById(\'oldColor' + this.inputTextId + '\').value, \'' + this._objectId + '\', \'' + this.inputTextId + '\', \'' + this.styleColor + '\'); document.getElementById(\'setc' + this.inputTextId + '\').value=\'0\'; ">';
    table += '<div id="allcolorselements' + this.inputTextId + '" style="width: ' + this.allwidth + 'px;height:' + this.allheight + 'px; cursor: pointer; display: none; position: absolute; z-index:1000; background-color:#bbb; border:solid 1px #bbb;">';

    for (var i = 1, c = 0; i <= this.rows; i++) {
        //table += '<tr height="20">';
        for (var j = 1; j <= this.cols; j++) {
            table += '<div style="background:' + this.pallete[c++] + '; float:left; width:' + this.width + 'px; height:' + this.width + 'px; margin:' + this.border + 'px; border:solid ' + this.border + 'px #000;" onmousedown="document.getElementById(\'setc' + this.inputTextId + '\').value=\'1\'; document.getElementById(\'oldColor' + this.inputTextId + '\').value=this.style.backgroundColor;" onmousemove="Colors.changecolor(this.style.backgroundColor, \'' + this._objectId + '\', \'' + this.inputTextId + '\', \'' + this.styleColor + '\');" onmouseover="this.style.border=\'solid ' + this.border + 'px #ffff00\'" onmouseout="this.style.border=\'solid ' + this.border + 'px #000\';"></div>';
        }
        table += '<div style="clear:both;"></div>';
    }
    table += '</div></a>';
    document.writeln(table);
}

//показывает палитру
Colors.SetVisible = function (inputTextId, allWidth, allHeight) {
    var divElement = document.getElementById('allcolorselements' + inputTextId);

    var imageElement = document.getElementById('image' + inputTextId);
    if ((allWidth + imageElement.offsetLeft) < document.body.offsetWidth) {
        divElement.style.left = imageElement.offsetLeft - 18;
    }
    else {
        divElement.style.left = document.body.offsetWidth - allWidth - 30;
    }

    if ((allHeight + imageElement.offsetTop) < document.body.offsetHeight) {
        divElement.style.top = imageElement.offsetTop + 18;
    }
    else {
        divElement.style.top = document.body.offsetHeight - allHeight - 30;
    }
    document.getElementById('allcolorselementslink' + inputTextId).focus();
    divElement.style.display = 'block';
}


// вспомогательная функция преобразование из формата rgb(0,0,0) в hex
Colors.rgb2hex = function (rgb) {
    if (!rgb) {
        return '000000';
    }
    if (rgb.substring(0, 1) == "#") {
        return rgb.substring(1);
    }
    else {
        var s, i, h = '', x = '0123456789abcdef';
        var c = rgb.substring(4);
        c = c.substring(0, c.length - 1);

        if (c) {
            s = c.split(',');
            for (i = 0; i < 3; i++) {
                n = parseInt(s[i]);
                h += x.charAt(n >> 4) + x.charAt(n & 15);
            }
            return h;
        }
    }
}

Colors.changecolor = function (thiscolor, _object, inputText, styleColor) {
    eval('document.getElementById(_object).style.' + styleColor + ' = thiscolor');
    document.getElementById(inputText).value = Colors.rgb2hex(thiscolor);
}

Colors.setup = function (params) {
    function param_default(pname, def) {
        if (typeof params[pname] == "undefined") {
            params[pname] = def;
        }
    };
    param_default("rows", 8);
    param_default("cols", 32);
    param_default("width", 20);
    param_default("border", 1);
    param_default("styleColor", "color");
    param_default("inputTextId", null);
    param_default("objectId", null);
    param_default("pallete", new Array(
        '#FFFFFF', '#FFFFCC', '#FFFF99', '#FFFF66', '#FFFF33', '#FFFF00', '#FFCCFF', '#FFCCCC', '#FFCC99', '#FFCC66', '#FFCC33', '#FFCC00', '#FF99FF', '#FF99CC', '#FF9999', '#FF9966', '#FF9933', '#FF9900', '#FF66FF', '#FF66CC', '#FF6699', '#FF6666', '#FF6633', '#FF6600', '#FF33FF', '#FF33CC', '#FF3399', '#FF3366', '#FF3333', '#FF3300', '#FF00FF', '#FF00CC',
        '#FF0099', '#FF0066', '#FF0033', '#FF0000', '#CCFFFF', '#CCFFCC', '#CCFF99', '#CCFF66', '#CCFF33', '#CCFF00', '#CCCCFF', '#CCCCCC', '#CCCC99', '#CCCC66', '#CCCC33', '#CCCC00', '#CC99FF', '#CC99CC', '#CC9999', '#CC9966', '#CC9933', '#CC9900', '#CC66FF', '#CC66CC', '#CC6699', '#CC6666', '#CC6633', '#CC6600', '#CC33FF', '#CC33CC', '#CC3399', '#CC3366',
        '#CC3333', '#CC3300', '#CC00FF', '#CC00CC', '#CC0099', '#CC0066', '#CC0033', '#CC0000', '#99FFFF', '#99FFCC', '#99FF99', '#99FF66', '#99FF33', '#99FF00', '#99CCFF', '#99CCCC', '#99CC99', '#99CC66', '#99CC33', '#99CC00', '#9999FF', '#9999CC', '#999999', '#999966', '#999933', '#999900', '#9966FF', '#9966CC', '#996699', '#996666', '#996633', '#996600',
        '#9933FF', '#9933CC', '#993399', '#993366', '#993333', '#993300', '#9900FF', '#9900CC', '#990099', '#990066', '#990033', '#990000', '#66FFFF', '#66FFCC', '#66FF99', '#66FF66', '#66FF33', '#66FF00', '#66CCFF', '#66CCCC', '#66CC99', '#66CC66', '#66CC33', '#66CC00', '#6699FF', '#6699CC', '#669999', '#669966', '#669933', '#669900', '#6666FF', '#6666CC',
        '#666699', '#666666', '#666633', '#666600', '#6633FF', '#6633CC', '#663399', '#663366', '#663333', '#663300', '#6600FF', '#6600CC', '#660099', '#660066', '#660033', '#660000', '#33FFFF', '#33FFCC', '#33FF99', '#33FF66', '#33FF33', '#33FF00', '#33CCFF', '#33CCCC', '#33CC99', '#33CC66', '#33CC33', '#33CC00', '#3399FF', '#3398CC', '#339999', '#339966',
        '#339933', '#339900', '#3366FF', '#3366CC', '#336699', '#336666', '#336633', '#336600', '#3333FF', '#3333CC', '#333399', '#333366', '#333333', '#333300', '#3300FF', '#3300CC', '#330099', '#330066', '#330033', '#330000', '#00FFFF', '#00FFCC', '#00FF99', '#00FF66', '#00FF33', '#00FF00', '#00CCFF', '#00CCCC', '#00CC99', '#00CC66', '#00CC33', '#00CC00',
        '#0099FF', '#0099CC', '#009999', '#009966', '#009933', '#009900', '#0066FF', '#0066CC', '#006699', '#006666', '#006633', '#006600', '#0033FF', '#0033CC', '#003399', '#003366', '#003333', '#003300', '#0000FF', '#0000CC', '#000099', '#000066', '#000033', '#EE0000', '#DD0000', '#BB0000', '#AA0000', '#880000', '#770000', '#550000', '#440000', '#220000',
        '#110000', '#00EE00', '#00DD00', '#00BB00', '#00AA00', '#008800', '#007700', '#005500', '#004400', '#002200', '#001100', '#0000EE', '#0000DD', '#0000BB', '#0000AA', '#000088', '#000077', '#000055', '#000044', '#000022', '#000011', '#EEEEEE', '#DDDDDD', '#BBBBBB', '#AAAAAA', '#888888', '#777777', '#555555', '#444444', '#222222', '#111111', '#000000'
    ));
    param_default("outImage", "rgb.gif");
    param_default("overImage", "on_rgb.gif");

    var col = new Colors(params.objectId, params.inputTextId, params.styleColor, params.pallete);

    col.rows = params.rows;
    col.cols = params.cols;
    col.width = params.width;
    col.border = params.border;
    col.allwidth = col.cols * (col.width + 2 + col.border * 4) + col.border;
    col.allheight = col.rows * (col.width + col.border * 4) + col.border;
    col.outImage = params.outImage
    col.overImage = params.overImage

    col.show();

    return col;
}
