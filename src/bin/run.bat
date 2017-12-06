@echo off
set SERVER_NAME=smlIfManager
set SERVER_TAG=%SERVER_NAME%
LIB=../lib
set class_path=%CLASSPATH%;%cd%\..\conf;
FOR %%F IN (%cd%\..\lib\*.jar) DO call :addcp %%F
goto extlibe
:addcp
SET class_path=%class_path%;%1
goto :eof
:extlibe
echo %class_path%
%JAVA_HOME%\bin\java -mx50M -ms5M  -Dfile.encoding=UTF-8 -Diname=%SERVER_TAG% -classpath %class_path%  org.hw.sml.support.ioc.BeanHelper
pause