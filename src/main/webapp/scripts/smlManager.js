"use strict";
//depend jquery&&jquery-json&&date.format
var smlManager ={
	metaInfo:{
		baseUrl:window.location.href.split('pages')[0],//结尾带/
		defaultUpdateUrlPre:'sml/update/',
		defaultQueryUrlPre:'sml/query/',
		defaultBeanMethodUrlPre:'sml/invoke/',
		defaultType:'post',
		defaultMime:'application/json; charset=utf-8',
		tables:{}},
	init:function(url,tableMetas){
		this.metaInfo.baseUrl=url||this.metaInfo.baseUrl;
		this.metaInfo.tables=tableMetas||this.metaInfo.tables;
	},
	ajax:function(obj){
		obj.url=this.metaInfo.baseUrl+obj.url;
		obj.type=obj.type||this.metaInfo.defaultType;
		obj.contentType=obj.contentType||this.metaInfo.defaultMime;
		obj.data=typeof(obj.data)=='object'&&obj.type=='post'&&obj.contentType.indexOf('x-www-form-urlencoded')<=0?JSON.stringify(obj.data):obj.data;
		obj.accept=obj.accept||this.metaInfo.defaultMime;
		obj.headers={accept:obj.accept};
		obj.dataType=obj.dataType||'json';
		$.ajax(obj);
	},
	query:function(ifId,params,successCallback,url,type){
		this.ajax({url:url||this.metaInfo.defaultQueryUrlPre+ifId,data:params,contentType:params&&params.params&&params.params!='undefined'||type&&type=='get'?'application/x-www-form-urlencoded; charset=utf-8':null,
				success:successCallback,type:type})
	},
	get:function(ifId,params,successCallback,url){
		this.query(ifId,params,successCallback,url,'get');
	},
	post:function(ifId,params,successCallback,url){
		this.query(ifId,params,successCallback,url,'post');
	},
	//operator insert|update|adu|delete|common |ifId
	updateTable:function(tableId,operator,params,successCallback,url){
		var sendData={};
		var isArray=params&&params.constructor.toString().indexOf('Array')>-1;
		if(isArray){
			sendData.datas=params;
		}else{
			sendData.data=params;
		}
		if(operator=='insert'||operator=='delete'){
			sendData.tableName=this.metaInfo.tables[tableId].tableName;
		}else if(operator=='update'||operator=='adu'){
			sendData.tableName=this.metaInfo.tables[tableId].tableName;
			sendData.conditions=this.metaInfo.tables[tableId].conditions;
		}else{
			sendData=params;
		}
		this.ajax({url:url||this.metaInfo.defaultUpdateUrlPre+operator,data:sendData,success:successCallback});
	},
	add:function(tableId,params,successCallback,url){
		this.updateTable(tableId,'insert',params,successCallback,url);
	},
	update:function(tableId,params,successCallback,url){
		if(this.metaInfo.tables[tableId])
			this.updateTable(tableId,'update',params,successCallback,url);
		else
			this.updateTable(null,tableId,params,successCallback,url);
	},
	del:function(tableId,params,successCallback,url){
		this.updateTable(tableId,'delete',params,successCallback,url);
	},
	adu:function(tableId,params,successCallback,url){
		this.updateTable(tableId,'adu',params,successCallback,url);
	},
	queryBM:function(beanMethod,params,successCallback,uri,type){
		this.query(uri,params,successCallback,this.metaInfo.defaultBeanMethodUrlPre+beanMethod.replace('.','/')+'/'+(uri||beanMethod.split('.')[1]),type);
	},
	getBM:function(beanMethod,params,successCallback,uri){
		this.queryBM(beanMethod,params,successCallback,uri,'get');
	},
	postBM:function(beanMethod,params,successCallback,uri){
		this.queryBM(beanMethod,params,successCallback,uri,'post');
	},
	getBMUrl:function(beanMethod,uri){
		return this.metaInfo.baseUrl+this.metaInfo.defaultBeanMethodUrlPre+beanMethod.replace('.','/')+'/'+(uri||beanMethod.split('.')[1]);
	},
	uuid:function(type){
		if(type&&type=='guid'){
			var guid='';
			for(var i=0;i<8;i++){
				guid+=smlManager.guid();
			}
			return guid;
		}else{
			return new Date().format("yyyyMMddhhmmss");
		}
	},
	guid:function(){
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
	},
	clone:function(obj,arr){
		var result={};
		if(arr){
			for(var i=0;i<arr.length;i++){
				result[arr[i]]=obj[arr[i]];
			}
		}else{
			result=obj;
		}
		return JSON.parse(JSON.stringify(result));
	}
};