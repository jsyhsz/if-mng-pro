create table DM_CO_BA_CFG_RCPT_IF
(
  id             VARCHAR2(128) primary key,
  mainsql        CLOB,
  rebuild_info   CLOB default '{}',
  condition_info VARCHAR2(4000) default '{}',
  cache_enabled  NUMBER default 0,
  cache_minutes  NUMBER default 5,
  db_id          VARCHAR2(128),
  describe       VARCHAR2(4000),
  update_time    DATE default sysdate
);
create table DM_CO_BA_CFG_RCPT_IF_log
(
  id             VARCHAR2(128) not null,
  mainsql        CLOB,
  rebuild_info   CLOB default '{}',
  condition_info VARCHAR2(4000) default '{}',
  cache_enabled  NUMBER default 0,
  cache_minutes  NUMBER default 5,
  db_id          VARCHAR2(128),
  describe       VARCHAR2(4000),
  update_time    DATE default sysdate
);
insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngBuilderQuery', 'select * from dm_co_ba_cfg_rcpt_if_builder ', '0
toLowerCaseForKey=false', 'defJt', 1, 120, 'defJt', '接口配置管理-包装器枚举', to_date('24-10-2017 17:54:08', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-enum-dss', 'select ''defJt'' as "id_",''默认'' as "name_" from dual
union all
select ''ahDC'' ,''资源库''  from dual', 'GroupFieldDataBuilder
groupname=id_
oriFields=id_,name_
newFields=id_,name_@el(''#{T(sun.misc.BASE64Encoder).encode(#{(''$value'').getBytes()})}'')', '{}', 1, 120, 'defJt', '接口配置管理-数据源枚举', to_date('05-12-2017 18:57:38', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngEgQuery', 'select * from DM_CO_BA_CFG_RCPT_IF_EG where id=#id#', '{"type":"0"}', '{
"sqlParams":
[
{"name":"id","type":"char","enabled":"1"}
]
}', 0, 5, 'defJt', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngEgUpdate', '<if test=" ''@update_type''==''insert'' ">
  insert into DM_CO_BA_CFG_RCPT_IF_EG(id,param_info,db_id,descr,url,id_eg) values(#id#,#param_info#,#db_id#,#descr#,#url#,#id_eg#)
</if>

<if test=" ''@update_type''==''delete'' ">
  delete from DM_CO_BA_CFG_RCPT_IF_EG where id_eg=#id_eg#
</if>

<if test=" ''@update_type''==''deleteId'' ">
  delete from DM_CO_BA_CFG_RCPT_IF_EG where id=#id#
</if>


<if test=" ''@update_type''==''update'' ">
  update DM_CO_BA_CFG_RCPT_IF_EG set id=#id#,param_info=#param_info#,db_id=#db_id#,descr=#descr#,url=#url# where id_eg=#id_eg#
</if>', '{"type":"0"}', '{
"sqlParams":
[
{"name":"id","type":"char","enabled":"1","descr":"id"},
{"name":"param_info","type":"char","enabled":"1","descr":"地市id"},
{"name":"db_id","type":"char","enabled":"1","descr":"地市id"},
{"name":"descr","type":"char","enabled":"1","descr":"地市id"},
{"name":"url","type":"char","enabled":"1","descr":"地市id"},
{"name":"update_type","type":"char","enabled":"1","descr":"地市id"},
{"name":"id_eg","type":"char","enabled":"1","descr":"地市id"}
]
}', 0, 0, 'defJt', '接口配置管理-测试样例表update操作', to_date('05-12-2017 16:57:28', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngFieldQuery', '  select
<isNotEmpty property="fields">
    $fields$
</isNotEmpty>
<isEmpty property="fields">
        id, mainsql,rebuild_info,condition_info,cache_enabled,cache_minutes,db_id,describe,update_time
</isEmpty>
from  dm_co_ba_cfg_rcpt_if  where id=#id#', '{"type":"0"}', '{
"sqlParams":
[
{"name":"id","type":"char","enabled":"1"},
{"name":"fields","type":"char","enabled":"1","defaultValue":"","descr":"是否所有"}
]
}', 0, 0, 'defJt', '接口配置管理-根据id查字段查询', to_date('05-12-2017 17:14:31', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngIfUpdate', '<if test=" ''@update_type''==''insert'' ">
  insert into dm_co_ba_cfg_rcpt_if(id,mainsql,rebuild_info,condition_info,cache_enabled,cache_minutes,db_id,describe,update_time)
  values(#id#,#mainsql#,#rebuild_info#,#condition_info#,#cache_enabled#,#cache_minutes#,#db_id#,#describe#,#update_time#)
</if>

<if test=" ''@update_type''==''delete'' ">
  delete from dm_co_ba_cfg_rcpt_if where id=#id#
</if>


<if test=" ''@update_type''==''update'' ">
  update dm_co_ba_cfg_rcpt_if set mainsql=#mainsql#,rebuild_info=#rebuild_info#,condition_info=#condition_info#,
  cache_enabled=#cache_enabled#,cache_minutes=#cache_minutes#,db_id=#db_id#,describe=#describe#,update_time=#update_time#  where id=#id#
</if>', 'DefaultDataBuilder
#拦截-返回key是否小写拦截
toLowerCaseForKey=false
#拦截-返回oriFields,newFields是否忽视只返回配置字段
oriFields=
newFields=
igFieldFilter=false', '{
"sqlParams":
[
{"name":"id","type":"char","enabled":"1","descr":"id"},
{"name":"mainsql","type":"char","enabled":"1","descr":"地市id"},
{"name":"rebuild_info","type":"number","enabled":"1","descr":"地市id"},
{"name":"condition_info","type":"char","enabled":"1","descr":"地市id"},
{"name":"cache_enabled","type":"number","enabled":"1","descr":"地市id"},
{"name":"cache_minutes","type":"number","enabled":"1","descr":"地市id"},

{"name":"db_id","type":"char","enabled":"1","descr":"地市id"},
{"name":"describe","type":"char","enabled":"1","descr":"地市id"},
{"name":"update_time","type":"date","enabled":"1","descr":"地市id"},
{"name":"update_type","type":"char","enabled":"1","descr":"地市id"}
]
}', 0, 0, 'defJt', '接口配置管理-接口表update操作', to_date('05-12-2017 17:03:19', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngLike', '<select id="select">

select substr(id,1,instr(id,''-'',1)-1)  sign ,id,mainsql,rebuild_info,condition_info,cache_enabled,db_id,nvl(describe,id) describe,update_time update_time from dm_co_ba_cfg_rcpt_if where 1=1
<isNotEmpty property="id"> and  id like ''%''||#id#||''%''  </isNotEmpty>
<isNotEmpty property="describe"> and (describe like ''%''||#describe#||''%''  or id like ''%''||#describe#||''%'')</isNotEmpty>

</select>

<if test=" ''@queryType''==''select'' ">
      select * from (select t1.*, rownum row_ from (<included id="select"/>
      <isNotEmpty property="sidx">
            order by $sidx$ $sord$ nulls last
      </isNotEmpty>
      ) t1) where row_ >= (#page# - 1) * #limit# + 1 and row_ < #page# * #limit# + 1
 </if>
<if test=" ''@queryType''==''count'' ">
      select count(1) as "total"   from (<included id="select"/>)
</if> ', 'PageDataBuilder
#分页相关参数名称标识设定
pageMark=page
limitMark=limit
#拦截-返回key是否小写拦截
toLowerCaseForKey=false
#拦截-返回oriFields,newFields是否忽视只返回配置字段
oriFields=UPDATE_TIME
newFields=UPDATE_TIME@date(''yyyy-MM-dd HH:mm:ss'')
igFieldFilter=true', '{
  "sqlParams": [
    {
      "name": "id",
      "type": "char",
      "defaultValue": "",
      "descr": "id",
      "enabled": "1"
    },
    {
      "name": "describe",
      "type": "char",
      "defaultValue": "",
      "descr": "id",
      "enabled": "1"
    },
    {
      "name": "queryType",
      "type": "char",
      "defaultValue": "count",
      "descr": "查询选择",
      "enabled": "1"
    },
    {
      "name": "page",
      "type": "number",
      "defaultValue": "1",
      "descr": "当前页",
      "enabled": "1"
    },
    {
      "name": "limit",
      "type": "char",
      "defaultValue": "10",
      "descr": "每页大小",
      "enabled": "1"
    },
    {
      "name": "sidx",
      "type": "char",
      "defaultValue": "id",
      "descr": "排序字段",
      "enabled": "1"
    },
    {
      "name": "sord",
      "type": "char",
      "defaultValue": "asc",
      "descr": "排序方式",
      "enabled": "1"
    }
  ]
}', 0, 0, 'defJt', '接口配置管理-模糊查询', to_date('25-10-2017 13:47:58', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngMenu', '<if test=" ''@query_type''==''menu'' ">
select * from dm_co_ba_cfg_rcpt_if_menu start with id=''0''
　　connect by prior id=parent_id order by type,seq,parent_id
</if>

<if test=" ''@update_type''==''insert'' ">
insert into dm_co_ba_cfg_rcpt_if_menu(id,name,type,parent_id,descr,creator,update_time)
values(#id#,#name#,#type#,#parent_id#,#descr#,#creator#,#update_time#)
</if>

<if test=" ''@update_type''==''update'' ">
update  dm_co_ba_cfg_rcpt_if_menu set name=#name#,type=#type#,parent_id=#parent_id#,
 descr = #descr#,  creator=#creator#, update_time=#update_time#  where id=#id#
</if>

<if test=" ''@update_type''==''deleteIf'' ">
delete from dm_co_ba_cfg_rcpt_if_menu where id=#id#
</if>

<if test=" ''@update_type''==''deleteMenu'' ">
delete from dm_co_ba_cfg_rcpt_if_menu where id in (select id from dm_co_ba_cfg_rcpt_if_menu start with id =#id# connect by prior id=parent_id)
</if>', '{
"type":3,
"groupname":"ID"
}', 'query_type,char
update_type,char
id,char
name,char
type,char
parent_id,char
descr,char
creator,char
update_time,char', 0, 0, 'defJt', '接口配置管理-菜单-展示', to_date('05-12-2017 15:21:12', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngTreeOrLike', 'select substr(id,1,instr(id,''-'',1)-1)  sign ,id,nvl(describe,id) describe,to_char(update_time,''yyyy-mm-dd hh24:mi:ss'') update_time from dm_co_ba_cfg_rcpt_if
where id like ''%-%''
<isNotEmpty property="id"> and id like ''%''||#id#||''%'' </isNotEmpty>
order by sign ', '{
"type":2,
"groupname":"SIGN"
}', '{
"sqlParams":
[
{"name":"id","type":"char","enabled":"1"},
{"name":"formatJson","type":"char","defaultValue":"false","enabled":"1"}
]
}', 0, 5, 'defJt', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngLogUpdate', '<if test=" ''@update_type''==''insert'' ">
  insert into DM_CO_BA_CFG_RCPT_IF_LOG(id,mainsql,rebuild_info,condition_info,cache_enabled,cache_minutes,db_id,describe,update_time) 
  values(#id#,#mainsql#,#rebuild_info#,#condition_info#,#cache_enabled#,#cache_minutes#,#db_id#,#describe#,#update_time#)
</if>', 'DefaultDataBuilder
#拦截-返回key是否小写拦截
toLowerCaseForKey=false
#拦截-返回oriFields,newFields是否忽视只返回配置字段
oriFields=
newFields=
igFieldFilter=false', '{
"sqlParams":
[
{"name":"id","type":"char","enabled":"1","descr":"id"},
{"name":"mainsql","type":"char","enabled":"1","descr":"地市id"},
{"name":"rebuild_info","type":"number","enabled":"1","descr":"地市id"},
{"name":"condition_info","type":"char","enabled":"1","descr":"地市id"},
{"name":"cache_enabled","type":"char","enabled":"1","descr":"地市id"},
{"name":"cache_minutes","type":"number","enabled":"1","descr":"地市id"},
{"name":"db_id","type":"char","enabled":"1","descr":"地市id"},
{"name":"describe","type":"char","enabled":"1","descr":"地市id"},
{"name":"update_time","type":"date","enabled":"1","descr":"地市id"},
{"name":"update_type","type":"char","enabled":"1","descr":"地市id"}
]
}', 0, 0, 'defJt', '接口配置管理-日志表update操作', to_date('06-12-2017 13:31:34', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-copyInter', '<if test=" ''@opLinks''==''menu'' ">
insert into dm_co_ba_cfg_rcpt_if_menu
select #id#,#name#,type,parent_id,descr,creator,sysdate,seq from dm_co_ba_cfg_rcpt_if_menu where id=#oldId#
</if>

<if test=" ''@opLinks''==''if'' ">
insert into dm_co_ba_cfg_rcpt_if
select #id#,mainsql,rebuild_info,condition_info,cache_enabled,cache_minutes,db_id,#name#,sysdate from dm_co_ba_cfg_rcpt_if where id=#oldId#
</if>

', 'DefaultDataBuilder
#拦截-返回key是否小写拦截
toLowerCaseForKey=false
#拦截-返回oriFields,newFields是否忽视只返回配置字段
oriFields=
newFields=
igFieldFilter=false', '{
"sqlParams":
[
{"name":"id","type":"char","defaultValue":"","descr":"接口id","enabled":"0"},
{"name":"name","type":"char","defaultValue":"","descr":"接口名称","enabled":"0"},
{"name":"opLinks","type":"char","defaultValue":"menu-if","descr":"menu-if","enabled":"0"},
{"name":"oldId","type":"char","defaultValue":"","descr":"老接口id","enabled":"0"}
]
}', 0, 0, 'defJt', '接口配置管理-复制接口', to_date('05-12-2017 17:12:34', 'dd-mm-yyyy hh24:mi:ss'));




-- Create table
create table DM_CO_BA_CFG_RCPT_IF_MENU
(
  id          VARCHAR2(128) not null,
  name        VARCHAR2(256),
  type        NUMBER(1),
  parent_id   VARCHAR2(128),
  descr       VARCHAR2(256),
  creator     VARCHAR2(25),
  update_time VARCHAR2(25)
);
insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('0', '接口管理', 0, '00', '总目录', '', '20161104144800');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('20161105165300', '接口管理', 0, '0', '接口管理', '', '20161107165300');
insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-enum-dss', '接口配置管理-数据源枚举', 1, '20161105165300', '接口', 'hw', '20171013102503');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngBuilderQuery', '接口配置管理-包装器枚举', 1, '20161105165300', '', 'zxw', '20161107165400');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngEgQuery', '接口配置管理-测试样例查询', 1, '20161105165300', '', 'zxw', '20161107165400');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngEgUpdate', '接口配置管理-测试样例表update操作', 1, '20161105165300', '', 'zxw', '20161107165400');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngFieldQuery', '接口配置管理-根据id查字段查询', 1, '20161105165300', '', 'zxw', '20161107165400');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngIfUpdate', '接口配置管理-接口表update操作', 1, '20161105165300', '', 'zxw', '20161107165400');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngLike', '接口配置管理-模糊查询', 1, '20161105165300', 'fq', 'zxw', '20170919111925');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngLogUpdate', '接口配置管理-日志表update操作', 1, '20161105165300', '', 'zxw', '20161107165400');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngMenu', '接口配置管理-菜单-展示', 1, '20161105165300', '', 'zxw', '20161107165400');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngTreeOrLike', '接口配置管理-树图展示', 1, '20161105165300', '', 'zxw', '20161107165400');

-- Create table
create table DM_CO_BA_CFG_RCPT_IF_BUILDER
(
  id        NUMBER(3),
  name      VARCHAR2(256),
  classpath VARCHAR2(256),
  jar       VARCHAR2(128),
  descr     VARCHAR2(256),
  type      VARCHAR2(25)
);

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (1, '分页页面请求，返回Result(count,datas)', 'PageDataBuilder', '', 'page=1
limit=20', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (10, '分组-返回-Map<Object,Map<String,Object>>', 'GroupFieldDataBuilder', '', 'groupname=
oriFields=
newFields=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (2, '默认包装器', 'DefaultDataBuilder', '', 'toLowerCaseForKey=false', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (3, '表头重命名包装求', 'FieldDataBuilder', '', 'oriFields=
newFields=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (4, '二次分组-Single返回-Map<V,Map<V,Map<K,V>>>', 'Group2FieldDataBuilder', '', 'groupname=
oriFields=
newFields=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (5, '二次分组-返回-Map<V,Map<V,List<Map<K,V>>>>', 'Group2FieldListDataBuilder', '', 'groupname=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (6, '分组-返回-Map<V,List<Map<K,V>>>', 'GroupDataBuilder', '', 'groupname=
groupFields=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (7, '重命名', 'MapDataBuilder', '', 'oriFields=
newFields=
extMap=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (8, '结果格式包装器-返回-Map<String,List<Object>>', 'MapListDataBuilder', '', 'oriFields=
newFields=
extMap=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (9, '排序并取TopN', 'OrderDataBuilder', '', 'orderName=
orderType=
topN=', '');
--接口测试样例表
create table DM_CO_BA_CFG_RCPT_IF_EG
(
  id         VARCHAR2(128),
  param_info VARCHAR2(512),
  db_id      VARCHAR2(128),
  descr      VARCHAR2(128),
  url        VARCHAR2(256),
  id_eg      VARCHAR2(128) not null primary key
);