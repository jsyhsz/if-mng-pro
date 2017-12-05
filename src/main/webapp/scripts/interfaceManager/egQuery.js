$(function(){
	egQuery.init();
});
"use strict";
var egQuery = {
		init : function(){
			var nodeData = window.parent.interfaceManager.getNodeData(),
				id = nodeData.id,
				name = nodeData.name;
			smlManager.get('if-cfg-interMngEgQuery',{id:id},function(result){
				egQuery.initTree(id, name);
				egQuery.loadTree(id, result.data);
				$("#id").val(id);
				var node = $("#treeEg").tree("find", id);
				smlManager.get('if-cfg-interMngFieldQuery',{id:id},function(query_result){
					if(query_result.success){
						var condition_info = query_result.data[0].CONDITION_INFO,
							rebuild_info = query_result.data[0].REBUILD_INFO;
						node.attributes.condition_info = condition_info;
						node.attributes.rebuild_info = rebuild_info;
					}else{
						alert(result.data);
					}
					$("#mm1").data("node", node);
					egQuery.initPageData();
				});
			});
			
		},
		//初始化tree结构
		initTree : function(id, name){
			var initData = [{
				"id" : id,
				"text" : name,
				"state" : "closed",
				"attributes" : {
					"rank" : 1
				}
			}];
			$("#treeEg").tree({
				data : initData,
				lines : true,
				animate : true,
				onContextMenu : function(e, node){
					e.preventDefault();
					$("#treeEg").tree("select", node.target);
					if(node.attributes.rank == 1){
						//如果节点为1级Tree, 显示mm1, 以此类推
						$("#mm1").menu("show", {
							left : e.pageX,
							top : e.pageY
						});
						$("#mm1").data("node", node);
					}else if(node.attributes.rank == 2){
						$("#mm2").menu("show", {
							left : e.pageX,
							top : e.pageY
						});
						$("#mm2").data("node", node);
					}
				},
				onSelect : function(node){
					if(node.attributes.rank == 2){
						$("#mm2").data("node", node);
//						$("#descr").val(node.text);
						document.getElementById("descr").value = node.text;
						var url = node.attributes.url,
							url_head = "",
							url_body = "",
							id = $("#id").val();
//						$("#url").val(url);
						document.getElementById("url").value = url;
						if(url.endWith(id)){	//如果URL以接口标识结尾
//							$("#edit_url_ifId").prop("checked", true);
							document.getElementById("edit_url_ifId").checked = true;
							url = url.replace(id, "");	//url去掉  接口标识
							//从url的倒数第二个"/"+1位置处, 截取到末尾, 获取url_body
							url_body = url.substring(url.lastIndexOf("/", url.lastIndexOf("/")-1) + 1);
							url_head = url.replace(url_body, "");
						}else{
//							$("#edit_url_ifId").prop("checked", false);
							document.getElementById("edit_url_ifId").checked = false;
						}
//						$("#url_body").val(url_body);
//						$("#url_head").val(url_head);
//						$("#param_info").val(node.attributes.param_info);
						document.getElementById("url_body").value = url_body;
						document.getElementById("url_head").value = url_head;
						document.getElementById("param_info").value = node.attributes.param_info;
						formatEgParamToParam(node.attributes.param_info, "param");
//						$("#result").val("");
//						$("#btn_add").hide();
//						$("#btn_save").show();
//						$("#btn_test").show();
						document.getElementById("result").value = "";
						document.getElementById("btn_add").style.display = "none";
						document.getElementById("btn_save").style.display = "";
						document.getElementById("btn_test").style.display = "";
					}
				}
			});
		},
//		--------------------拼       装       tree      数       据----------------------
		loadTree : function(id, dataArr){
			var arr = [];
			for(var i=0, len=dataArr.length; i<len; i++){
				var obj = {};
				obj.id = dataArr[i].ID_EG;
				obj.text = dataArr[i].DESCR;
				obj.attributes = {
//					"db_id" : dataArr[i].DB_ID,
					"param_info" : dataArr[i].PARAM_INFO,
					"url" : dataArr[i].URL,
					"rank" : 2
				};
                arr.push(obj);
			}
			var parent = $("#treeEg").tree("find", id).target;
			$('#treeEg').tree("append", {parent: parent, data: arr});	//一级tree加载完成
//-----------------添加完tree数据后, 展开第一级
			var node = $("#treeEg").tree("find", id);
			$("#treeEg").tree("expand", node.target);
		},
//		--------------初      始      化      界      面      信      息-----------------------
		initPageData : function(){
			var node = $("#mm1").data("node"),
				url_head = smlManager.metaInfo.baseUrl+"sml/",	//获取当前项目url
				//url_head = "http://10.221.247.7:8080/INAS/sml/",
				url_body = "query/",
				id = node.id,
				condition_info = node.attributes.condition_info,
				rebuild_info = node.attributes.rebuild_info;
			$("#url_head").val(url_head);
			$("#url_body").val(url_body);
			$("#edit_url_ifId").prop("checked", true);
			$("#url").val(url_head + url_body + id);
//			----------初始化参数
			if(id != "epc-dns-logQuery"){	//暂时根据id单独判断
				var egParam = formatJsonToEgParam(condition_info, "param_info");
				formatEgParamToParam(egParam, "param");	//转换参数格式
			}else{
				var param = formatJsonToParamForPage(condition_info, id, "param");
				if(!formatParamToEgParam(param, "param_info")){
					document.getElementById("param").focus();
				}
			}
			$("#result").val("");
			$("#descr").val("");
			$("#btn_add").show();
			$("#btn_save").hide();
			$("#btn_test").show();
		},
	
//		-----------------拼       装       URL------------------------------------------
		editUrl : function(){
			var url_head = $("#url_head").val(),
				url_body = $("#url_body").val(),
				url_foot = $("#id").val(),
				url = url_head + url_body;
			if($("#edit_url_ifId").is(":checked")){
				url += url_foot;
			}
			$("#url").val(url);
		},
//		-----------------拼       装       参       数------------------------------------------
		changeParam : function(){
			var param = $("#param").val();
			if(!formatParamToEgParam(param, "param_info")){
				document.getElementById("param").focus();
			}
		},
//		--------------------清       空       返       回       结      果---------------------------------------------
		clearResult : function(){
			$("#result").val("");
			smlManager.getBM('smlHelperService.clear',{},function(){},$("#id").val());
		},
//		----------------------提          交           添          加--------------------------------
		submitAdd : function(){
			var id = $("#id").val(),
				descr = $("#descr").val(),
				url = $("#url").val(),
				param_info = $("#param_info").val(),
				update_time = smlManager.uuid(),
				data = {
					"update_type":"insert",
					"id_eg": update_time,                                	//--接口id_eg-根据id修改
					"id": id,
					"param_info":param_info,                           //--参数
					"db_id":"srpt",                         		//--数据源id
					"descr":descr,                             	//--描述
					"url":url              						//--接口url
				};
				smlManager.update('if-cfg-interMngEgUpdate',data,function(result){
					if(result.success){
						var node = $("#mm1").data("node");
						$("#btn_add").hide();
						$("#btn_save").show();
						$("#btn_test").show();
						$("#treeEg").tree("append", {
							parent : node.target,
							data : [{
								id : update_time,
								text : descr,
								attributes : {
									"param_info" : param_info,
									"url" : url,
									"rank" : 2
								}
							}]
						});
						var node_child = $("#treeEg").tree("find", update_time);
						$("#mm2").data("node", node_child);
						//alert("添加测试样例成功!");
					}else{
						alert(result.msg);
					}
				});
		},
//		---------------------保                          存------------------------------------
		save : function(){
			var node = $("#mm2").data("node"),
				id = $("#id").val(),
				descr = $("#descr").val(),
				url = $("#url").val(),
				param_info = $("#param_info").val(),
				ajaxUrl = "/sml/update/if-cfg-interMngEgUpdate",
				data = {
						"update_type":"update",
						"id_eg": node.id,                                	//--接口id-根据id修改
						"id" : id,
						"param_info":param_info,                           //--参数
						"db_id":"srpt",                         		//--数据源id
						"descr":descr,                             	//--描述
						"url":url              						//--接口url
				};
				smlManager.update('if-cfg-interMngEgUpdate',data,function(result){
					if(result.success){
						$("#treeEg").tree("update", {
							target : node.target,
							text : descr,
							attributes : {
								"param_info" : param_info,
								"url" : url,
								"rank" : 2
							}
						});
						//alert("保存样例成功!");
					}else{
						alert(result.msg);
					}
				});
			
		},
//		------------------------删                         除--------------------------------------
		del : function(){
			var msg = "是否确认删除?";
			if(confirm(msg)){
				var node = $("#mm2").data("node"),
					ajaxUrl = "/sml/update/if-cfg-interMngEgUpdate",
					data = {
						"update_type":"delete",
						"id_eg": node.id
					},
					dataStr = JSON.stringify(data),
					result = commonAjax(ajaxUrl, dataStr);
				smlManager.update('if-cfg-interMngEgUpdate',data,function(result){
					if(result.success){
						$("#descr").val("");
						$("#url").val("");
						$("#param_info").val("{}");
						$("#result").val("");
						$("#btn_add").hide();
						$("#btn_save").hide();
						$("#btn_test").hide();
						$("#treeEg").tree("remove", node.target);
					}else{
						alert(result.msg);
					}
				});
			}
		},
//		-------------------------测                                试------------------------------
		testEg : function(){
			var reqType = $("#requestType").val(),
				url = $("#url").val(),
				data = $("#param_info").val();
			var obj = {
					url : url,
					data : data,
					type : "post",
					dataType : "json",
					accessType : "application/json",
					async : false,
					success : function(result){
						if(result.success){
							var formatted = JSON.stringify(result.data, null, 4);
							formatted = formatted
								.replace(/\\\"/g, "\"")
								.replace(/\\n/g, "\n")
								.replace(/\\r/g, "\r")
								.replace(/\\t/g, "\t");

							$("#result").val(formatted);
						}else{
							("#result").val(result.msg);
						}
					},
					error : function(){
						alert("测试失败, 请检查url、参数或请求类型是否错误!");
					}
			};
			if(reqType == "form"){
				obj.data = JSON.parse(data);
			}else if(reqType == "request"){
				obj.contentType = "application/json";
			}
			$.ajax(obj);
		}
};