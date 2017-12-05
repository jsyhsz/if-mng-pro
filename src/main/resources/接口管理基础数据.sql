create table DM_CO_BA_CFG_RCPT_IF
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
toLowerCaseForKey=false', 'defJt', 0, 5, 'defJt', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));
insert into DM_CO_BA_CFG_RCPT_IF (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-enum-dss', 'select ''defJt'' as id_,''Ĭ��'' as name_ from dual', 'GroupFieldDataBuilder
groupname=id_
oriFields=
newFields=
toLowerCaseForKey=true', '{}', 0, 0, 'defJt', '�ӿ����ù���-����Դö��', to_date('13-10-2017 10:25:03', 'dd-mm-yyyy hh24:mi:ss'));
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
{"name":"param_info","type":"char","enabled":"1","descr":"����id"},
{"name":"db_id","type":"char","enabled":"1","descr":"����id"},
{"name":"descr","type":"char","enabled":"1","descr":"����id"},
{"name":"url","type":"char","enabled":"1","descr":"����id"},
{"name":"update_type","type":"char","enabled":"1","descr":"����id"},
{"name":"id_eg","type":"char","enabled":"1","descr":"����id"}
]
}', 0, 5, 'defJt', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));

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
{"name":"fields","type":"char","enabled":"1","defaultValue":"","descr":"�Ƿ�����"}
]
}', 0, 5, 'defJt', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));

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
</if>', '{"type":"0"}', '{
"sqlParams":
[
{"name":"id","type":"char","enabled":"1","descr":"id"},
{"name":"mainsql","type":"char","enabled":"1","descr":"����id"},
{"name":"rebuild_info","type":"number","enabled":"1","descr":"����id"},
{"name":"condition_info","type":"char","enabled":"1","descr":"����id"},
{"name":"cache_enabled","type":"number","enabled":"1","descr":"����id"},
{"name":"cache_minutes","type":"number","enabled":"1","descr":"����id"},

{"name":"db_id","type":"char","enabled":"1","descr":"����id"},
{"name":"describe","type":"char","enabled":"1","descr":"����id"},
{"name":"update_time","type":"date","enabled":"1","descr":"����id"},
{"name":"update_type","type":"char","enabled":"1","descr":"����id"}
]
}', 0, 5, 'defJt', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngLike', '<select id="select">

select substr(id,1,instr(id,''-'',1)-1)  sign ,id,mainsql,rebuild_info,condition_info,cache_enabled,db_id,describe,to_char(update_time,''yyyy-mm-dd hh24:mi:ss'') update_time from dm_co_ba_cfg_rcpt_if where 1=1 
<isNotEmpty property="id"> and  id like ''%''||#id#||''%'' </isNotEmpty> 
<isNotEmpty property="describe"> and describe like ''%''||#describe#||''%'' </isNotEmpty> 

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
</if> ', 'PageDataBuilder', '{
"sqlParams":
[
{"name":"id","type":"char","enabled":"1","descr":"id"},
{"name":"describe","type":"char","enabled":"1","descr":"id"},
{"name":"queryType","type":"char","enabled":"1","defaultValue":"count","descr":"����id"},
{"name":"page","type":"number","enabled":"1","defaultValue":"1","descr":"����id"},
{"name":"limit","type":"char","enabled":"1","defaultValue":"10","descr":"����id"},
{"name":"sidx","type":"char","enabled":"1","defaultValue":"id","descr":"����id"},
{"name":"sord","type":"char","enabled":"1","defaultValue":"asc","descr":"����id"}
]
}', 0, 5, 'defJt', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngLogUpdate', 'select * from dm_co_ba_cfg_rcpt_if_builder ', '0
toLowerCaseForKey=false', 'defJt', 0, 5, 'if-cfg-interMngBuilderQuery', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngMenu', '<if test=" ''@query_type''==''menu'' ">
select * from dm_co_ba_cfg_rcpt_if_menu start with id=''0''
����connect by prior id=parent_id
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
update_time,char', 0, 5, 'defJt', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));

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
values ('0', '�ӿڹ���', 0, '00', '��Ŀ¼', '', '20161104144800');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('20161105165300', '�ӿڹ���', 0, '0', '�ӿڹ���', '', '20161107165300');
insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-enum-dss', '�ӿ����ù���-����Դö��', 1, '20161105165300', '�ӿ�', 'hw', '20171013102503');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngBuilderQuery', '�ӿ����ù���-��װ��ö��', 1, '20161105165300', '', 'zxw', '20161107165400');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngEgQuery', '�ӿ����ù���-����������ѯ', 1, '20161105165300', '', 'zxw', '20161107165400');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngEgUpdate', '�ӿ����ù���-����������update����', 1, '20161105165300', '', 'zxw', '20161107165400');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngFieldQuery', '�ӿ����ù���-����id���ֶβ�ѯ', 1, '20161105165300', '', 'zxw', '20161107165400');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngIfUpdate', '�ӿ����ù���-�ӿڱ�update����', 1, '20161105165300', '', 'zxw', '20161107165400');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngLike', '�ӿ����ù���-ģ����ѯ', 1, '20161105165300', 'fq', 'zxw', '20170919111925');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngLogUpdate', '�ӿ����ù���-��־��update����', 1, '20161105165300', '', 'zxw', '20161107165400');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngMenu', '�ӿ����ù���-�˵�-չʾ', 1, '20161105165300', '', 'zxw', '20161107165400');

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME)
values ('if-cfg-interMngTreeOrLike', '�ӿ����ù���-��ͼչʾ', 1, '20161105165300', '', 'zxw', '20161107165400');

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
values (1, '��ҳҳ�����󣬷���Result(count,datas)', 'PageDataBuilder', '', 'page=1
limit=20', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (10, '����-����-Map<Object,Map<String,Object>>', 'GroupFieldDataBuilder', '', 'groupname=
oriFields=
newFields=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (2, 'Ĭ�ϰ�װ��', 'DefaultDataBuilder', '', 'toLowerCaseForKey=false', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (3, '��ͷ��������װ��', 'FieldDataBuilder', '', 'oriFields=
newFields=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (4, '���η���-Single����-Map<V,Map<V,Map<K,V>>>', 'Group2FieldDataBuilder', '', 'groupname=
oriFields=
newFields=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (5, '���η���-����-Map<V,Map<V,List<Map<K,V>>>>', 'Group2FieldListDataBuilder', '', 'groupname=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (6, '����-����-Map<V,List<Map<K,V>>>', 'GroupDataBuilder', '', 'groupname=
groupFields=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (7, '������', 'MapDataBuilder', '', 'oriFields=
newFields=
extMap=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (8, '�����ʽ��װ��-����-Map<String,List<Object>>', 'MapListDataBuilder', '', 'oriFields=
newFields=
extMap=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (9, '����ȡTopN', 'OrderDataBuilder', '', 'orderName=
orderType=
topN=', '');
--�ӿڲ���������
create table DM_CO_BA_CFG_RCPT_IF_EG
(
  id         VARCHAR2(128),
  param_info VARCHAR2(512),
  db_id      VARCHAR2(128),
  descr      VARCHAR2(128),
  url        VARCHAR2(256),
  id_eg      VARCHAR2(128) not null primary key
);