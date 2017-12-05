//正规sql 参数格式转换为 city=21格式
function formatJsonToParam(paramStr, paramTextArea_Id, paramDivArea_Id){
	"use strict";
	var param = "",
		htmlStr = "";
	if(paramStr && paramStr != "{}"){
		if(paramStr.indexOf('"sqlParams":') > 0){
			var jsonParam = JSON.parse(paramStr),
				jsonArr = jsonParam.sqlParams;
			for(var i=0, len=jsonArr.length; i<len; i++){
				var name = jsonArr[i].name ? jsonArr[i].name : "",
					value = jsonArr[i].defaultValue ? jsonArr[i].defaultValue : "",
					descr = jsonArr[i].descr ? jsonArr[i].descr : "",
					enabled = jsonArr[i].enabled ? jsonArr[i].enabled : "0",
					paramDiv = "";
				param += name + "=" + value;
				if(i != len-1){
					param += "\n";
				}
				if(parseInt(enabled)){
					paramDiv = '<label style="margin-bottom: 0px; color: red">*&nbsp&nbsp</label>';
				}
				htmlStr += '<div id="div_'+i+'" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; margin-right: 10px;padding: 4px;margin-bottom: 4px;" onclick="editInterface.addTextArea(this.id);"  onmouseover="editInterface.showTip(this.id);" oncontextmenu="hideTip();">'
					+ paramDiv + '<span style="display: inline-block; width: 70px; margin-right: 3px; text-align: right;">'+ descr +' :</span><span style="display: inline-block; width: 100px">'+ name + '</span></div>';
			}
		}else{
			var paramArr = paramStr.split("\n").notempty();	//按行分割
			for(var i=0, len=paramArr.length; i<len; i++){
				var paramArrArr = paramArr[i].split(","),	//行内参数, 按逗号分割
					name = paramArrArr[0] ? paramArrArr[0] : "",
					value = paramArrArr[2] ? paramArrArr[2] : "",
					descr = paramArrArr[3] ? paramArrArr[3] : "",
					enabled = paramArrArr[4] ? paramArrArr[4] : "0",
					paramDiv = "";
				param += name + "=" + value;
				if(i != len-1){
					param += "\n";
				}
				if(parseInt(enabled)){
					paramDiv = '<label style="margin-bottom: 0px; color: red">*&nbsp&nbsp</label>';
				}
				htmlStr += '<div id="div_'+i+'" style="background:#84e4fa  ;display: inline-block; border: 1px solid #e8e8e8 ;cursor: pointer; border-radius:5px; margin-right: 10px;padding: 4px;margin-bottom: 4px;" onclick="editInterface.addTextArea(this.id);" onmouseover="editInterface.showTip(this.id);" oncontextmenu ="hideTip();">'
						+ paramDiv + '<span style="display: inline-block; width: 70px; margin-right: 3px; text-align: right;">'+ descr +' :</span><span style="display: inline-block; width: 100px">'+ name + '</span></div>';
			}
		}
	}
	if(paramTextArea_Id){
//		$("#" + paramTextArea_Id).val(param);	//拼装参数
		document.getElementById(paramTextArea_Id).value = param;
	}
	if(paramDivArea_Id){
//		$("#" + paramDivArea_Id).html(htmlStr);	//分别添加参数块
		document.getElementById(paramDivArea_Id).innerHTML = htmlStr;
	}
	return param;
}
function hideTip(){
	document.getElementById("sel_div").style.display="none";
}
//city=21格式 转为正规 sql参数格式
function formatParamToJson(param, realParamTextArea_Id){
	"use strict";
	if(!realParamTextArea_Id){
		return;
	}
	var newRealParam = "";
	if(param){
//		$("#" + realParamTextArea_Id).val(newRealParam);
//		document.getElementById(realParamTextArea_Id).value = newRealParam;
		var paramArr = param.split("\n").notempty(),
	//		realParam = $("#" + realParamTextArea_Id).val(),
			realParam = document.getElementById(realParamTextArea_Id).value,
			reg = /\w+=\s*/;	//a=0形式
		if(realParam.indexOf('"sqlParams":') > 0){
			var jsonParam = JSON.parse(realParam),
				jsonArr = jsonParam.sqlParams;
			if(paramArr.length != jsonArr.length){
				alert("操作非法, 请撤销之前修改, 并点击\"编辑参数\"按钮进行操作!");
				return false;
			}
			for(var i=0, len=paramArr.length; i<len; i++){
//			----------------正则一下
				if(!reg.test(paramArr[i])){
					alert("参数格式有误, 请确保有一个\"=\"!");
					return false;
				}
				var arr = paramArr[i].split("="),
					name = arr[0].trim() || "",
					value = arr[1].trim() || "";
				jsonArr[i].name = name;
				jsonArr[i].defaultValue = value;
			}
			newRealParam = JSON.stringify(jsonParam, null, 2);
		}else{
			var realParamArr = realParam.split("\n").notempty();
			if(paramArr.length != realParamArr.length){
				alert("操作非法, 请撤销之前修改, 并点击\"编辑参数\"按钮进行操作!");
				return false;
			}
			for(var i=0, len=paramArr.length; i<len; i++){
//			----------------正则一下
				if(!reg.test(paramArr[i])){
					alert("参数格式有误, 请确保有一个\"=\"!");
					return false;
				}
				var paramArrArr = paramArr[i].split("="),
					realParamArrArr = realParamArr[i].split(","),
					name = paramArrArr[0] || "",
					value = paramArrArr[1] || "";
				if(realParamArrArr[0]){
					realParamArrArr[0] = name;
				}
				if(realParamArrArr[2]){
					realParamArrArr[2] = value;
				}
				for(var j=0, length=realParamArrArr.length; j<length; j++){
					newRealParam += realParamArrArr[j];
					if(j != length-1){
						newRealParam += ",";
					}
				}
				if(i != len-1){
					newRealParam += "\n";
				}
			}
		}
	}else{
		newRealParam = "{}";
	}
//	$("#" + realParamTextArea_Id).val(newRealParam);
	document.getElementById(realParamTextArea_Id).value = newRealParam;
	return true;
}
//正规sql参数 转换到table中
function formatJsonToTable(paramStr, table_id){
	"use strict";
	if(!paramStr || paramStr == "{}" || !table_id){
		return;
	}
//	$("#" + table_id + " tbody").empty();	//在执行方法前手动清空了
	if(paramStr.indexOf('"sqlParams":') > 0){
		var param = JSON.parse(paramStr),
			paramArr = param.sqlParams,
			htmlStr = [];
		for(var i=0, len=paramArr.length; i<len; i++){
			var name = paramArr[i].name || "",
				type = paramArr[i].type || "",
				defaultValue = paramArr[i].defaultValue || "",
				descr = paramArr[i].descr || "",
				enabled = paramArr[i].enabled || 0;
			htmlStr.push("<tr>");
			htmlStr.push('<td><input type="text" value=\"' + name + '\"\/></td>');
			var selStr = [
			              '<td>', 
				              '<select>', 
					              '<option value="char">char</option>', 
					              '<option value="array">array</option>',
					              '<option value="array-char">array-char</option>',
					              '<option value="number">number</option>',
					              '<option value="date">date</option>',
					              '<option value="array-date">array-date</option>',
				              '</select>',
			              '</td>'
			              ];
			htmlStr.push(
				selStr.join("\n").replace('value="' + type + '"', 'value="' + type + '" selected="selected"')
			);	//根据type 设置哪个选项默认选中
//			if(type == "char"){
//				htmlStr.push( 
//					'<td>' +
//						'<select>' + 
//							'<option selected="selected" value="char">char</option>' + 
//							'<option value="array">array</option>' + 
//							'<option value="array-char">array-char</option>' + 
//							'<option value="number">number</option>' + 
//							'<option value="date">date</option>' + 
//							'<option value="array-date">array-date</option>' + 
//						'</select>' + 
//					'</td>');
//			}else if(type == "array"){
//				htmlStr.push( 
//					'<td>' +
//						'<select>' + 
//							'<option value="char">char</option>' + 
//							'<option selected="selected" value="array">array</option>' + 
//							'<option value="array-char">array-char</option>' + 
//							'<option value="number">number</option>' + 
//							'<option value="date">date</option>' + 
//							'<option value="array-date">array-date</option>' + 
//						'</select>' + 
//					'</td>');
//			}else if(type == "array-char"){
//				htmlStr.push( 
//					'<td>' +
//						'<select>' + 
//							'<option value="char">char</option>' + 
//							'<option value="array">array</option>' + 
//							'<option selected="selected" value="array-char">array-char</option>' + 
//							'<option value="number">number</option>' + 
//							'<option value="date">date</option>' + 
//							'<option value="array-date">array-date</option>' + 
//						'</select>' + 
//					'</td>');
//			}else if(type == "number"){
//				htmlStr.push(
//					'<td>' +
//						'<select>' + 
//							'<option value="char">char</option>' + 
//							'<option value="array">array</option>' + 
//							'<option value="array-char">array-char</option>' + 
//							'<option selected="selected" value="number">number</option>' + 
//							'<option value="date">date</option>' + 
//							'<option value="array-date">array-date</option>' + 
//						'</select>' + 
//					'</td>');
//			}else if(type == "date"){
//				htmlStr.push(
//					'<td>' +
//						'<select>' + 
//							'<option value="char">char</option>' + 
//							'<option value="array">array</option>' + 
//							'<option value="array-char">array-char</option>' + 
//							'<option value="number">number</option>' + 
//							'<option selected="selected" value="date">date</option>' + 
//							'<option value="array-date">array-date</option>' + 
//						'</select>' + 
//					'</td>');
//			}else if(type == "array-date"){
//				htmlStr.push( 
//					'<td>' +
//						'<select>' + 
//							'<option value="char">char</option>' + 
//							'<option value="array">array</option>' + 
//							'<option value="array-char">array-char</option>' + 
//							'<option value="number">number</option>' + 
//							'<option value="date">date</option>' + 
//							'<option selected="selected" value="array-date">array-date</option>' + 
//						'</select>' + 
//					'</td>');
//			}else{
//				htmlStr.push(
//					'<td>' +
//						'<select>' + 
//							'<option value="char">char</option>' + 
//							'<option value="array">array</option>' + 
//							'<option value="array-char">array-char</option>' + 
//							'<option value="number">number</option>' + 
//							'<option value="date">date</option>' + 
//							'<option value="array-date">array-date</option>' + 
//						'</select>' + 
//					'</td>');
//			}
			htmlStr.push('<td><input type="text" value="' + defaultValue + '"\/></td>');
			htmlStr.push('<td><input type="text" value=\"' + descr + '\"\/></td>');
			if(parseInt(enabled) == 1){
				htmlStr.push('<td><input type="checkbox" checked="checked" style="margin:0px;"\/></td>');
			}else{
				htmlStr.push('<td><input type="checkbox" style="margin:0px;"\/></td>');
			}
			htmlStr.push(
					'<td>' + 
						'<a href="JavaScript:void(0)" onclick="editInterface.delParam(this);"><img src="../../static/interfaceManager/images/closehong.png"/></a>' + 
					'</td>');
			htmlStr.push("</tr>");
			//输入框可直接设置value, 但是其他的不行, 所以要一点一点去找到它们再去设置
//			$($("#" + table_id + " tbody tr")[i]).children("td").eq(1).children("select").val(type);
//			$($("#" + table_id + " tbody tr")[i]).children("td").eq(4).children("input[type='checkbox']").prop("checked", isMust);
		}
		$("#" + table_id + " tbody").append(htmlStr.join("\n"));
	}else{
		var paramArr = paramStr.split("\n").notempty(),
			htmlStr = [];
		for(var i=0, len=paramArr.length; i<len; i++){
			var paramArrArr = paramArr[i].split(","),
				name = paramArrArr[0] || "",
				type = paramArrArr[1] || "",
				defaultValue = paramArrArr[2] || "",
				descr = paramArrArr[3] || "",
				enabled = paramArrArr[4] || 0;
			htmlStr.push("<tr>");
			htmlStr.push('<td><input type="text" value=\"' + name + '\"/></td>');
			var selStr = [
			              '<td>', 
				              '<select>', 
					              '<option value="char">char</option>', 
					              '<option value="array">array</option>',
					              '<option value="array-char">array-char</option>',
					              '<option value="number">number</option>',
					              '<option value="date">date</option>',
					              '<option value="array-date">array-date</option>',
				              '</select>',
			              '</td>'
			              ];
			htmlStr.push(
				selStr.join("\n").replace('value="' + type + '"', 'value="' + type + '" selected="selected"')
			);
//			if(type == "char"){
//				htmlStr.push( 
//					'<td>' +
//						'<select>' + 
//							'<option selected="selected" value="char">char</option>' + 
//							'<option value="array">array</option>' + 
//							'<option value="array-char">array-char</option>' + 
//							'<option value="number">number</option>' + 
//							'<option value="date">date</option>' + 
//							'<option value="array-date">array-date</option>' + 
//						'</select>' + 
//					'</td>');
//			}else if(type == "array"){
//				htmlStr.push( 
//					'<td>' +
//						'<select>' + 
//							'<option value="char">char</option>' + 
//							'<option selected="selected" value="array">array</option>' + 
//							'<option value="array-char">array-char</option>' + 
//							'<option value="number">number</option>' + 
//							'<option value="date">date</option>' + 
//							'<option value="array-date">array-date</option>' + 
//						'</select>' + 
//					'</td>');
//			}else if(type == "array-char"){
//				htmlStr.push( 
//					'<td>' +
//						'<select>' + 
//							'<option value="char">char</option>' + 
//							'<option value="array">array</option>' + 
//							'<option selected="selected" value="array-char">array-char</option>' + 
//							'<option value="number">number</option>' + 
//							'<option value="date">date</option>' + 
//							'<option value="array-date">array-date</option>' + 
//						'</select>' + 
//					'</td>');
//			}else if(type == "number"){
//				htmlStr.push(
//					'<td>' +
//						'<select>' + 
//							'<option value="char">char</option>' + 
//							'<option value="array">array</option>' + 
//							'<option value="array-char">array-char</option>' + 
//							'<option selected="selected" value="number">number</option>' + 
//							'<option value="date">date</option>' + 
//							'<option value="array-date">array-date</option>' + 
//						'</select>' + 
//					'</td>');
//			}else if(type == "date"){
//				htmlStr.push(
//					'<td>' +
//						'<select>' + 
//							'<option value="char">char</option>' + 
//							'<option value="array">array</option>' + 
//							'<option value="array-char">array-char</option>' + 
//							'<option value="number">number</option>' + 
//							'<option selected="selected" value="date">date</option>' + 
//							'<option value="array-date">array-date</option>' + 
//						'</select>' + 
//					'</td>');
//			}else if(type == "array-date"){
//				htmlStr.push( 
//					'<td>' +
//						'<select>' + 
//							'<option value="char">char</option>' + 
//							'<option value="array">array</option>' + 
//							'<option value="array-char">array-char</option>' + 
//							'<option value="number">number</option>' + 
//							'<option value="date">date</option>' + 
//							'<option selected="selected" value="array-date">array-date</option>' + 
//						'</select>' + 
//					'</td>');
//			}else{
//				htmlStr.push(
//					'<td>' +
//						'<select>' + 
//							'<option value="char">char</option>' + 
//							'<option value="array">array</option>' + 
//							'<option value="array-char">array-char</option>' + 
//							'<option value="number">number</option>' + 
//							'<option value="date">date</option>' + 
//							'<option value="array-date">array-date</option>' + 
//						'</select>' + 
//					'</td>');
//			}
			htmlStr.push('<td><input type="text" value=\"' + defaultValue + '\"/></td>');
			htmlStr.push('<td><input type="text" value=\"' + descr + '\"/></td>');
			if(parseInt(enabled) == 1){
				htmlStr.push('<td><input type="checkbox" checked="checked" style="margin:0px;"/></td>');
			}else{
				htmlStr.push('<td><input type="checkbox" style="margin:0px;"/></td>');
			}
			htmlStr.push(
					'<td>' + 
						'<a href="JavaScript:void(0)" onclick="editInterface.delParam(this);"><img src="../../static/interfaceManager/images/closehong.png"></a>' + 
					'</td>');
			htmlStr.push("</tr>");
		}
		$("#" + table_id + " tbody").append(htmlStr.join("\n"));
	}
}
//正常参数转为 测试样例参数
function formatJsonToEgParam(paramStr, egParamTextArea_Id){
	"use strict";
	var egParamJson = {},
		egParam = "";
	if(paramStr && paramStr != "{}"){
		if(paramStr.indexOf('"sqlParams":') > 0){
			var jsonParam = JSON.parse(paramStr),
				jsonArr = jsonParam.sqlParams;
			for(var i=0, len=jsonArr.length; i<len; i++){
				var name = jsonArr[i].name || "",
					value = jsonArr[i].defaultValue || "";
				egParamJson[name] = value;
			}
		}else{
			var paramArr = paramStr.split("\n").notempty();	//按行分割
			for(var i=0, len=paramArr.length; i<len; i++){
				var paramArrArr = paramArr[i].split(","),	//行内参数, 按逗号分割
					name = paramArrArr[0] ? paramArrArr[0] : "",
					value = paramArrArr[2] ? paramArrArr[2] : "";
				egParamJson[name] = value;
			}
		}
		egParam = JSON.stringify(egParamJson, null, 2);
	}else{
		egParam = "{}";
	}
	if(egParamTextArea_Id){
//		$("#" + egParamTextArea_Id).val(egParam);	//拼装参数
		document.getElementById(egParamTextArea_Id).value = egParam;
	}
	return egParam;
}
//测试样例参数 转为 city=21形式
function formatEgParamToParam(egParam, paramTextArea_Id){
	"use strict";
	var param = "";
	if(egParam && egParam != "{}"){
		var egParamJson = JSON.parse(egParam);
		for(var key in egParamJson){
			param += key + "=" + egParamJson[key] + "\n";
		}
	}
	if(paramTextArea_Id){
//		$("#" + paramTextArea_Id).val(param);
		document.getElementById(paramTextArea_Id).value = param;
	}
	return param;
}
//city=21 转为测试样例参数
function formatParamToEgParam(param, egParamTextArea_Id){
	"use strict";
	var egParam = "";
	if(param){
		var paramArr = param.split("\n").notempty(),
			egParamJson = {},
			reg = /\w+=\s*/;	//a=0形式
		for(var i=0, len=paramArr.length; i<len; i++){
//		----------------正则一下
			if(!reg.test(paramArr[i])){
				alert("参数格式有误, 请确保有一个\"=\"!");
				return false;
			}
			var arr = paramArr[i].split("="),
				name = arr[0].trim() || "",
				value = arr[1].trim() || "";
			egParamJson[name] = value;
		}
		egParam = JSON.stringify(egParamJson, null, 2);
	}else{
		egParam = "{}";
	}
	if(egParamTextArea_Id){
//		$("#" + egParamTextArea_Id).val(egParam);
		document.getElementById(egParamTextArea_Id).value = egParam;
	}
	return true;
}
//如果包装器是PageDataBuilder (这个接口是用jqgrid插件请求的), 要单独格式化参数
function formatJsonToParamForPage(paramStr, ifId, paramTextArea_Id){
	"use strict";
	var param = "";
	if(paramStr && paramStr != "{}"){
		if(paramStr.indexOf('"sqlParams":') > 0){
			var jsonParam = JSON.parse(paramStr),
				jsonArr = jsonParam.sqlParams;
			var startTime = jsonArr.startTime || "",
				endTime = jsonArr.startTime || "";
			param += "params={" +
					"\"startTime\":\"" + startTime + "\"," + 
					"\"endTime\":\"" + endTime + "\"," + 
					"\"ifId\":\"" + ifId + "\"" +
					"}\n";
			for(var i=0, len=jsonArr.length; i<len; i++){
				var name = jsonArr[i].name ? jsonArr[i].name : "",
					value = jsonArr[i].defaultValue ? jsonArr[i].defaultValue : "";
				if(name == "startTime" || name == "endTime"){
					continue;
				}
				param += name + "=" + value;
				if(i != len-1){
					param += "\n";
				}
			}
		}else{
			var paramArr = paramStr.split("\n").notempty();	//按行分割
			param += "params={";
			for(var i=0, len=paramArr.length; i<len; i++){
				var paramArrArr = paramArr[i].split(","),	//行内参数, 按逗号分割
					name = paramArrArr[0] ? paramArrArr[0] : "",
					value = paramArrArr[2] ? paramArrArr[2] : "";
				if(name == "startTime"){
					param += "\"startTime\":\"" + value + "\",";
				}else if(name == "endTime"){
					param += "\"endTime\":\"" + value + "\",";
				}else{
					continue;
				}
			}
			param += "\"ifId\":\"" + ifId + "\"}\n";
			for(var i=0, len=paramArr.length; i<len; i++){
				var paramArrArr = paramArr[i].split(","),	//行内参数, 按逗号分割
					name = paramArrArr[0] ? paramArrArr[0] : "",
					value = paramArrArr[2] ? paramArrArr[2] : "";
				if(name == "startTime" || name == "endTime"){
					continue;
				}
				param += name + "=" + value;
				if(i != len-1){
					param += "\n";
				}
			}
		}
	}
	if(paramTextArea_Id){
//		$("#" + paramTextArea_Id).val(param);	//拼装参数
		document.getElementById(paramTextArea_Id).value = param;
	}
	return param;
}
//  ajax
function commonAjax(url, dataStr, type, async){
	"use strict";
	var baseURL = window.location.href,
		result = "";
	baseURL = baseURL.split("/pages")[0];
	if(!type || type == "" || type == null){
		type = 'POST';
	}
	if(!async ||async == "" || async ==null){
		async = false;
	}
	$.ajax({
		url : baseURL + url ,
		data : dataStr,
		type : type,
		dataType : "json",
		async : async,
		contentType : "application/json",
		accessType : "application/json",
		success : function(data){
			result = data;
		}
	});
	return result;
}
/**
 * 扩展Array方法, 去除数组中空白数据
 */
Array.prototype.notempty = function(){
	"use strict";
	for(var i=0; i<this.length; i++){
		if(this[i] == "" || typeof(this[i]) == "undefined" || this[i].startWith("#")){
			this.splice(i,1);
			i--;
		}
	}
	return this;
};
/**
 * 扩展String方法, 判断字符串是否以什么结尾
 */
//String.prototype.endWith = function(endStr){
//    var d = this.length-endStr.length;
//    return (d >= 0 && this.lastIndexOf(endStr) == d);
//};
String.prototype.endWith = function(str){
	"use strict";
	if(str==null||str==""||this.length==0||str.length>this.length){
		return false;
	}
	if(this.substring(this.length-str.length)==str){
		return true;
	}else{
		return false;
	}
	return true;
};
String.prototype.startWith = function(str){
	"use strict";
	if(str==null||str==""||this.length==0||str.length>this.length){
		return false;
	}
	if(this.substr(0,str.length)==str){
		return true;
	}else{
		return false;
	}
	return true;
};
/**
 * @param $
 * 自定义jQuery扩展方法, 在光标处插入内容
 */
(function ($) {
	"use strict";
    $.fn.extend({
        insertAtCaret : function (myValue) {
            var $t = $(this)[0];
            if (document.selection) {
                this.focus();
                var sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            } else
                if ($t.selectionStart || $t.selectionStart == '0') {
                    var startPos = $t.selectionStart;
                    var endPos = $t.selectionEnd;
                    var scrollTop = $t.scrollTop;
                    $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
                    this.focus();
                    $t.selectionStart = startPos + myValue.length;
                    $t.selectionEnd = startPos + myValue.length;
                    $t.scrollTop = scrollTop;
                } else {
                    this.value += myValue;
                    this.focus();
                }
        }
    });
})(jQuery);
/**
 *  对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
 * 例子： 
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
 */
Date.prototype.format = function (fmt) { //author: meizz 
	"use strict";
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};