$(function(){
	smlManager.metaInfo.tables['t_if_menu']={tableName:'dm_co_ba_cfg_rcpt_if_menu',conditions:['parent_id','id']};
	interfaceManager.init();
});
"use strict";
var nodeData = {},
	timeId = "",
	interfaceManager = {
		init : function(){
			smlManager.get("if-cfg-interMngMenu", {"query_type":"menu"},function(result){
				if(result.success){
					var dataArr = interfaceManager.recur('00', result.data);
					interfaceManager.initTree(dataArr);
					interfaceManager.initTab();
				}else{
					alertT(result.data);
				}
			});
		},
		recur : function(parentId, data){	//递归 打包数据为tree所需要格式
			var dataArr = [];
			for(var key in data){
				var value = data[key] || {},
					parent_id = value.PARENT_ID,
					type_num = value.TYPE,
					type = type_num.toString();
				if(parent_id == parentId){
					if("0" == type){	//根据parentId判断目录
						var id = value.ID,
							name = value.NAME,
							creator = value.CREATOR,
							descr = value.DESCR,
							children = interfaceManager.recur(id, data);
						var root = {
							"id" : id,
							"text" : name,
							"state" : "closed",
							"attributes" : {
								"type" : type,
								"parent_id" : parent_id,
								"descr" : descr,
								"creator" : creator
							},
							"children" : children
						};
						dataArr.push(root);
					}else if(type == "1"){	//根据type判断接口
						var id = value.ID,
							name = value.NAME,
							creator = value.CREATOR,
							descr = value.DESCR;
						var file = {
							"id" : id,
							"text" : name,
							"attributes" : {
								"type" : type,
								"parent_id" : parent_id,
								"descr" : descr,
								"creator" : creator
							}
						};
						dataArr.push(file);
					}
				}
			}
			return dataArr;
		},
		//初始化tree结构
		initTree : function(dataArr){
			$("#tree").tree({
				data : dataArr,
				lines : true,
				animate : true,	//动画效果
				dnd : true,	//拖放
				onlyLeafCheck:false,
				checkbox:true,
				onContextMenu : function(e, node){//右键事件
					e.preventDefault();
					$("#tree").tree("select", node.target);
					if(node.id == 0){	//节点为根目录, 显示mm1, 以此类推
						$("#mm1").menu("show", {left : e.pageX,top : e.pageY});
						$("#mm2").data("node", node);//加载到其它easyui组件将对象数据
					}else if(node.attributes.type == "0"){	//节点为文件夹
						$("#mm2").menu("show", {left : e.pageX,top : e.pageY});
						$("#mm2").data("node", node);
					}else if(node.attributes.type == "1"){	//节点为文件
						$("#mm3").menu("show", {left : e.pageX,top : e.pageY});
						$("#mm3").data("node", node);
					}
				},
				onDblClick : function(node){//双击事件
					if(node.attributes.type == "1"){//节点为文件
						$("#mm3").data("node", node);
						interfaceManager.editInter();
					}
				},//拖拽前
				onBeforeDrag : function(node){	//如果拖拽的是根目录,禁止拖放
					if(node.id != "0"){
						return node.checked;
					}
					return false;
				},
				//放入前
				onBeforeDrop : function(target, source, point){
					var node_parent = $("#tree").tree("getNode", target);
					if(node_parent.attributes.type == "0"){	//目标是文件夹才可以
						if(point == "append"){	//为放入操作才可以
							var msg = "确认把\""+ source.text +"\"\n移动到文件夹\""+ node_parent.text +"\"下";
							if(confirm(msg)){
								var	data = {
										"update_type" : "update",
										"id": source.id,
										"name": source.text,
										"type": source.attributes.type,
										"parent_id": node_parent.id,
										"descr": source.attributes.descr,
										"creator": source.attributes.creator,
										"update_time": smlManager.uuid()
									};
								var res=null;
								smlManager.ajax({url:smlManager.metaInfo.defaultUpdateUrlPre+'if-cfg-interMngMenu',data:data,async:false,success:function(result){
										res=result.success;
								}});
								return res;
							}
						}
					}else if(node_parent.id=='0'){
						return false;
					}
					return source.attributes.parent_id==node_parent.attributes.parent_id&&point!="append";
				}, 
				onDrop: function (target, source, point) {
					var node_parent = $("#tree").tree("getNode", target);
					interfaceManager.setNodeData(node_parent);
					if(source.attributes.parent_id==node_parent.attributes.parent_id&&point!="append"){
						var html = '';
						html += '<button class="btn btn-primary fr" style="width: 18%;padding: 1px 2px;margin-right: 3px;"' +
                        'onclick="interfaceManager.cancelEntitySeq();"> ' +
                        '<i class="fa fa-undo" aria-hidden="true"></i>撤销 </button>';
						html += '<button class="btn btn-primary fr" ' +
                        'style="width: 18%;padding: 1px 2px;margin-right: 3px;"' +
                        'onclick="interfaceManager.saveEntitySeq();"> ' +
                        '<i class="fa fa-floppy-o" aria-hidden="true"></i>保存 </button>';
						$('#chenggaodu').css('height',20).html(html);
					}
                }
			});
			//默认展开第一级
			var node = $("#tree").tree("find", "0");
			$("#tree").tree("expand", node.target);
		},
//		---------------------文        件        夹        区        域----------------------------------------------
		cancelEntitySeq:function(){
			$('#chenggaodu').css('height',0).html('');
		},
		saveEntitySeq:function(){
			var node_parent = nodeData;
			var node=$("#tree").tree("find",node_parent.attributes.parent_id);
			var result=[];
			for(var i=0;i<node.children.length;i++){
				result.push({id:node.children[i].id,seq:i,parent_id:node_parent.attributes.parent_id});
			}
			console.log(result.join(','));
			smlManager.update("t_if_menu",result,function(result){
				if(!result.success){
					alertT(result.msg);
				}
			});
			interfaceManager.cancelEntitySeq();
		},
		addDir : function(){
			//初始化modal
			$("#modal").modal("show");
			$("#modal_h4").text("新建目录");
			$("#modal_input_name").val("");
			$("#modal_input_creator").val("");
			$("#modal_submit").text("添 加").unbind("click").bind("click",interfaceManager.subAddDir);
		},
		subAddDir : function(){
			var node = $("#mm2").data("node"),
				name = $("#modal_input_name").val(),
				creator = $("#modal_input_creator").val();
			if(!name||!creator){
				alertT("输入不能为空!");
				return;
			}
			var children = node.children;
			if(children){	//children不为空才可以判断长度, 否则报错
				for(var i=0, len=children.length; i<len; i++){	//判断是否有同名
					if(name == children[i].text){
						alertT("已存在相同名称的目录!");
						return;
					}
				}
			}
			var	type = "0",
				parent_id = node.id,
				descr = "目录",
				update_time = smlManager.uuid(),
				data = {
					"update_type":"insert",
					"id" : update_time,
					"name" : name,
					"type" : type,
					"parent_id" : parent_id,
					"descr" : descr,
					"creator" : creator,
					"update_time" : update_time
				};
			smlManager.update("if-cfg-interMngMenu",data,function(result){
				if(result.success){
					$("#tree").tree("append", {	//tree中添加新元素
						"parent" : node.target,
						"data" : [{
							"id" : update_time,
							"text" : name,
							"state" : "closed",
							"attributes" : {
								"type" : type,
								"parent_id" : parent_id,
								"descr" : descr,
								"creator" : creator
							},
							"children" : []
						}]
					});
					$("#tree").tree("expand", node.target);
					$("#modal").modal("hide");
				}else{
					alertT(result.data);
				}
			});
		},
		updateDir : function(){
			var node = $("#mm2").data("node");
			$("#modal").modal("show");
			$("#modal_h4").innerText = "修改目录名";
			$("#modal_input_name").val(node.text);
			$("#modal_input_creator").val(node.attributes.creator);
			$("#modal_submit").text("修 改").unbind("click").bind("click",interfaceManager.subUpDir);
		},
		subUpDir : function(){
			var node = $("#mm2").data("node"),
				name = $("#modal_input_name").val(),
				creator = $("#modal_input_creator").val(),
				id = node.id,
				type = node.attributes.type,
				parent_id = node.attributes.parent_id,
				descr = node.attributes.descr;
			if(name == node.text){
				alertT("与原名称相同!");
				return;
			}
			if(!name || !creator){
				alertT("输入不能为空!");
				return;
			}
			data = {
					"update_type":"update",
					"id" : id,
					"name" : name,
					"type" : type,
					"parent_id" : parent_id,
					"descr" : descr,
					"creator" : creator,
					"update_time" : smlManager.uuid()
			};
			node.attributes.creator=creator;
			smlManager.update('if-cfg-interMngMenu',data,function(result){
				if(result.success){
					$("#tree").tree("update", {	//更新tree
						"target" : node.target,
						"text" : name
					});
					$("#modal").modal("hide");
				}else{
					alertT(result.data);
				}
			});
		},
//		----------------------接        口        区        域-----------------------------------------
		addInter : function(){
			var node = $("#mm2").data("node"),
				title = node.text,
				tab_title = title + "-新建接口";		//拼接好tabs选项卡名
			if(!$("#tabs").tabs("exists", tab_title)){	//不存在就添加, 存在即选中
				nodeData = {	//全局变量, 因为是添加, 所以先重置
						"type" : "1",
						"parent_id" : node.id
				};
				var url = "editInterface.html",
					content = "<iframe id='mainframe' name='mainframe' src="+url+" style='width:100%;height:100%' frameborder='0' scrolling='auto'></iframe>",
					option = {
						title : tab_title,
						content : content,
						closable : true,
						iconCls : 'icontabstitle'
					};
				$("#tabs").tabs("add", option);
				//var $tab_visible = $("#tabs .panel:visible");
				//$tab_visible.find("#mainframe").height("100%");	//修复iframe高度bug, 暂用这个办法吧
			}else{
				$("#tabs").tabs("select",tab_title);
			}
		},
		delDir : function(){
			var node = $("#mm2").data("node"),
				msg = '将会删除"' + node.text + '"下所有接口, 是否确认?';
			if(confirm(msg)){
				interfaceManager.subDelDir(node);
			}
		},
		subDelDir : function(node){
			var children = node.children;
			for(var i=0, len=children.length; i<len; i++){
				var child = children[i],
					type = child.attributes.type;
				if(type == "0"){
					interfaceManager.subDelDir(child);
				}else if(type == "1"){
//					----------------删除测试样例
					var child_id = child.id,
						text = child.text;
						smlManager.update('if-cfg-interMngEgUpdate',{"update_type": "deleteId","id": child_id},
								function(result_del_eg){
							if(result_del_eg.success){
								//---------------查询接口详细信息
								smlManager.get('if-cfg-interMngFieldQuery',{"id" : child_id},function(result_query_inter){
									if(result_query_inter.success){
										//------------再添加日志
										var result_data = result_query_inter.data[0],
											id = result_data.ID,
											mainsql = result_data.MAINSQL,
											rebuild_info = result_data.REBUILD_INFO,
											condition_info = result_data.CONDITION_INFO,
											cache_enabled = result_data.CACHE_ENABLED.toString(),
											cache_minutes = result_data.CACHE_MINUTES.toString(),
											db_id = result_data.DB_ID,
											describe = result_data.DESCRIBE,
											update_time = result_data.UPDATE_TIME.toString(),
											data_log = {
												"update_type":"insert",
												"id": id,
												"mainsql": mainsql,
												"rebuild_info": rebuild_info,
												"condition_info": condition_info,
												"cache_enabled": cache_enabled,
												"cache_minutes": cache_minutes,
												"db_id": db_id,
												"describe": describe,
												"update_time": update_time
											};
											smlManager.update('if-cfg-interMngLogUpdate',data_log,function(result_log){
												if(result_log.success){
													//--------------------真正删除
													smlManager.update('if-cfg-interMngIfUpdate',{
														"update_type":"delete",
														"id": child_id       
													},function(result_del_inter){
														if(result_del_inter.success){
															//--------------最后删除菜单表中接口
															smlManager.update('if-cfg-interMngMenu',{
																"update_type" : "deleteIf",
																"id": child_id
															},function(result_menu_inter){
																if(result_menu_inter.success){
																	$("#tabs").tabs("close", text);	//关闭选项卡
																	$("#tabs").tabs("close", text + "-测试样例");
																	////删除所有接口后,再删菜单表的文件夹
																}else{
																	alertT(result_menu_inter.data);
																}
															});
														}else{
															alertT(result_del_inter.data);
														}
													});
												}else{
													alertT(result_log.data);
												}
											});
									}else{
										alertT(result_query_inter.data);
									}
								});
							}else{
								alertT(result_del_eg.data);
							}
						});
				}
				var id = node.id,
				text = node.text,
				data = {
					"update_type" : "deleteMenu",
					"id" : id
				};
				smlManager.update('if-cfg-interMngMenu',data,function(result){
					if(result.success){
						$("#tree").tree("remove", node.target);
						$("#tabs").tabs("close", text + "-新建接口");
					}else{
						alertT(result.data);
					}
				});
			}
		},
		editInter : function(){
			clearTimeout(timeId);
			var node = $("#mm3").data("node"),
				id = node.id,
				tab_title = node.text;
			nodeData = {
				"id" : id,
				"name" : tab_title,
				"type" : node.attributes.type,
				"parent_id" : node.attributes.parent_id,
				"descr" : node.attributes.descr,
				"creator" : node.attributes.creator
			};
			if(!$("#tabs").tabs("exists", tab_title)){	//不存在就添加, 存在即选中
				var url = "editInterface.html",
					content = "<iframe id='mainframe' name='mainframe' src="+url+" style='width:100%;' frameborder='0' scrolling='auto'></iframe>",
					option = {
						title : tab_title,
						content : content,
						closable : true,
						iconCls : 'icontabstitle'
					};
				$("#tabs").tabs("add", option);
				var $tab_visible = $("#tabs .panel:visible");
				$tab_visible.find("#mainframe").height("100%");
			}else{
				$("#tabs").tabs("select", tab_title);
			}
		},
		//删除接口
		delInter : function(){
			var node = $("#mm3").data("node"),
				msg = "确定删除接口\"" + node.text + "\"吗?";
			if(confirm(msg)){
				interfaceManager.subDelInter(node);
			}
		},
		subDelInter : function(node){
			var	inter_id = node.id,
				text = node.text;
			//---------------删除测试样例
			smlManager.update('if-cfg-interMngEgUpdate',{"update_type": "deleteId","id": inter_id},function(result_del_eg){
				if(result_del_eg.success){
					//-----------查询接口详细信息
					smlManager.get('if-cfg-interMngFieldQuery',{id:inter_id},function(result_query_inter){
						if(result_query_inter.success){
							//------------再添加日志
							var result_data = result_query_inter.data[0],
								id = result_data.ID,
								mainsql = result_data.MAINSQL,
								rebuild_info = result_data.REBUILD_INFO,
								condition_info = result_data.CONDITION_INFO,
								cache_enabled = result_data.CACHE_ENABLED.toString(),
								cache_minutes = result_data.CACHE_MINUTES.toString(),
								db_id = result_data.DB_ID,
								describe = result_data.DESCRIBE,
								update_time = result_data.UPDATE_TIME.toString(),
								data_log = {
									"update_type":"insert",
									"id": id,
									"mainsql": mainsql,
									"rebuild_info": rebuild_info,
									"condition_info": condition_info,
									"cache_enabled": cache_enabled,
									"cache_minutes": cache_minutes,
									"db_id": db_id,
									"describe": describe,
									"update_time": update_time
								};
							smlManager.update('if-cfg-interMngLogUpdate',data_log,function(result_log){
								if(result_log.success){
									//------------------真正删除
									smlManager.update('if-cfg-interMngIfUpdate',{"update_type":"delete","id": inter_id},function(result_del_inter){
										if(result_del_inter.success){
											//-----------删除菜单表
											smlManager.update('if-cfg-interMngMenu',{"update_type" : "deleteIf","id": inter_id},function(result_menu_inter){
												if(result_menu_inter.success){
													$("#tree").tree("remove", node.target);
													$("#tabs").tabs("close", text);
													$("#tabs").tabs("close", text + "-测试样例");
													alert("删除成功!");
												}else{
													alertT(result_menu_inter.data);
												}
											});
										}else{
											alertT(result_del_inter.data);
										}
									});
								}else{
									alertT(result_log.data);
								}
							});
						}else{
							alertT(result_query_inter.data);
						}
					});
				}else{
					alertT(result_del_eg.data);
				}
			});
			
		},
//		--------------------选        项        卡        区           域-----------------------------------------------
		initTab : function(){
			$("#tabs").tabs({
				border:false,
				onSelect : function(title, index){
					
			    },
			    onContextMenu : function(e, title, index){
			    	e.preventDefault();
			    	$('#mm').menu('show', {
						left: e.pageX,
						top: e.pageY
					});
					$('#mm').data("tab_title", title);
					$("#mm").data("tab_index", index);
					$('#tabs').tabs('select', index);
			    },
			    onBeforeClose : function(title, index){
			    	if(index == "0"){
			    		return false;
			    	}
			    }
			});
		},
		//tab右键菜单事件
		tabEvent : {
			close : function(){
				var tab_index = $("#mm").data("tab_index");
				$("#tabs").tabs("close", tab_index);
			},
			closeLeft : function(){
				var tab_index = $("#mm").data("tab_index"),
					$tabs = $("#tabs");
				for(var i=tab_index-1; i>0; i--){
					$tabs.tabs("close", i);
				}
				$("#tabs").tabs("select", 1);
			},
			closeRight : function(){
				var tab_index = $("#mm").data("tab_index"),
					i = tab_index + 1,
					$tabs = $("#tabs");
				while($tabs.tabs("exists", i)){
					$tabs.tabs("close", i);	//不知道怎么获取有几个tab,所以用while逐个判断是否存在
				}
			},
			closeOther : function(){
				this.closeRight();
				this.closeLeft();	//一定要 先关闭右边, 否则会出问题
				$("#tabs").tabs("select", 1);
			},
			closeAll : function(){
				this.closeRight();
				this.close();	//同样原理, 一定要从右开始关闭, 执行顺序不可变
				this.closeLeft();	//或者直接仿照closeRight方法,把i改为1即可
			},
			exit : function(){
				$('#mm').menu('hide');
			}
		},
//		------------------------模         糊         查         询-------------------------------------------
		search : function(){
			smlManager.get('if-cfg-interMngLike',{"describe" : $("#seekInterfaceName").val()},function(result){
					resultData = result.data.datas,
					dom_table = document.getElementById("resultSeekInterfaceName").getElementsByTagName("table")[0],
					htmlArr = [];
					if(!result.success){
					htmlArr.push('<br/><h4 style="margin-left:113px">查询异常!</h4>');
					}else if(resultData.length == 0){
						htmlArr.push('<br/><h4 style="margin-left:113px">没有查询到相应接口!</h4>');
					}else{
					var col = 4;
					for(var i=0, len=resultData.length; i<len; i++){
						var num = i % col;
						if(num == 0){
							htmlArr.push("<tr>");
						}
						htmlArr.push('<td style="border-top:0px;width: 25%;">');
						htmlArr.push('<a onclick="interfaceManager.selectTree(\'' + resultData[i].ID + '\');" '+
								'ondblclick="interfaceManager.editInter();" ' + 
								'style="color: blue;text-decoration:underline ;cursor: pointer;font-size: 17px;" >'+resultData[i].DESCRIBE+'</a>');
						htmlArr.push("</td>");
						if(num == col-1 || i == len-1){
							htmlArr.push("</tr>");
						}
					}
				}
				dom_table.innerHTML = htmlArr.join("\n");
			});
		},
		clearSearch : function(){
			$("#seekInterfaceName").val("");
			$("#resultSeekInterfaceName table").html("");
		},
//		------------------------------------------------------------------------
		selectTree : function(id){
			timeId = setTimeout(function() {
				var node = $("#tree").tree("find", id),
					root = $("#tree").tree("find", "0");
				$("#tree").tree("collapseAll", root.target);
				$("#tree").tree("expandTo", node.target);
				$("#tree").tree("select", node.target);
				$("#mm3").data("node", node);
			}, 100);
		},
//		-------------------设         置         nodeData       区              域----------------------------------------
		getNodeData : function(){
			return nodeData;
		},
		createNodeData : function(data){
			interfaceManager.setNodeData(data);
			var id = data.id,
				name = data.name,
				type = data.type,
				parent_id = data.parent_id,
				descr = data.descr,
				creator = data.creator,
				parent_node = $("#tree").tree("find", parent_id);
//				tab = $("#tabs").tabs("getSelected");
			$("#tree").tree("append", {
				parent : parent_node.target,
				data : [{
					"id" : id,
					"text" : name,
					"attributes" : {
						"type" : type,
						"parent_id" : parent_id,
						"descr" : descr,
						"creator" : creator
					}
				}]
			});
			$("#tree").tree("expand", parent_node.target);
		},
		updateNodeData : function(data){	//若子页面有修改, 把tree中的数据也同时修改
			interfaceManager.setNodeData(data);
			var id = data.id,
				name = data.name,
				type = data.type,
				parent_id = data.parent_id,
				descr = data.descr,
				creator = data.creator,
				node = $("#tree").tree("find", id);
//				tab = $("#tabs").tabs("getSelected");
			$("#tree").tree("update", {
				"target" : node.target,
				"text" : name,
				"attributes" : {
					"type" : type,
					"parent_id" : parent_id,
					"descr" : descr,
					"creator" : creator
				}
			});
//			$("#tabs").tabs("update", {
//				tab : tab,
//				options : {
//					title : text,
//				}
//			});
//			//tabs更新后会刷新下, 要重新设置iframe高度
//			$("#tabs #mainframe").height("100%");
		},
		setNodeData : function(data){
			nodeData = data;
		},
		createTestEg : function(data){
			interfaceManager.setNodeData(data);
			var name = data.name,
				tab_title = name + "-测试样例";
			if(!$("#tabs").tabs("exists", tab_title)){
					var content = "<iframe id='mainframe' name='mainframe' src='egQuery.html' style='width:100%;' frameborder='0' scrolling='auto'></iframe>",
					option = {
						title : tab_title,
						content : content,
						closable : true,
						iconCls : 'icontabstitle'
					};
				$("#tabs").tabs("add", option);
				var $tab_visible = $("#tabs .panel:visible");
				$tab_visible.find("#mainframe").height("100%");
			}else{
				$("#tabs").tabs("select", tab_title);
			}
		},
		copyInter:function(){
			var node = $("#mm3").data("node"),
			id = node.id,
			text = node.text;
			$("#modal_copy").modal("show");
			$("#modal_input_id_copy").val(id);
			$("#modal_input_name_copy").val(text);
			$("#modal_submit_copy").text("复制").unbind("click").bind("click",interfaceManager.copySubInter);
		},
		copySubInter:function(){
			var data = $("#mm3").data("node"),
			id = data.id,
			parent_id = data.attributes.parent_id,
			parent_node = $("#tree").tree("find", parent_id);
			newId=$("#modal_input_id_copy").val(),
			newText=$("#modal_input_name_copy").val(),
		    newNode=smlManager.clone(data,['id','text','attributes']);
			newNode.id=newId;
			newNode.text=newText;
			newNode.attributes.descr=newText;
			smlManager.update('if-cfg-copyInter',{id:newId,name:newText,oldId:id},function(result){
				if(result.success){
					$("#tree").tree("append",{
						parent : parent_node.target,
						data : [newNode]
					});
					$("#modal_copy").modal("hide");
				}else{
					alertT(result.msg);
				}
				
			});
			
		}
};
function alertT(msg){
	$.messager.alert('错误',msg,'error');
}