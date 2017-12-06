#!/bin/bash
SERVER_NAME="smlIfManager"
SERVER_TAG=$SERVER_NAME
LIB=../lib
CLASSPATH=.:
for i in $LIB/*.jar ;
        do
                CLASSPATH="$CLASSPATH":"$i"
        done
        CLASSPATH="$CLASSPATH":../conf
echo $CLASSPATH

SCRIPT="java  -mx128M -ms32M  -Diname=$SERVER_TAG  -Xrs  -classpath $CLASSPATH org.hw.sml.support.ioc.BeanHelper"
SCRIPT_SERVER_IDS=`ps -ef | grep "Diname=$SERVER_TAG" | grep -v grep | awk '{print $2}'`
is_server_run(){
        tmp=`ps -ef |grep "Diname=$SERVER_TAG" | grep -v grep`
        if [ $? -eq 0 ]; then
           return 0
        else
           return 1
        fi
     }
start_server(){
        is_server_run
        if [ $? -eq 0 ]; then 
                echo "$SERVER_NAME already started!"
                return 1
        fi
        nohup $SCRIPT >> ../logs/nohup.out &
        echo "$SERVER_NAME started!"
}

kill_server(){
        is_server_run

        if [ ! $? -eq 0 ]; then
                echo "$SERVER_NAME hasn't started yet!"
        else
                $SHUTDOWN_SCRIPT 
        fi
				
		is_server_run
				
		if [ ! $? -eq 0 ]; then
                echo "$SERVER_NAME stoped!"
				return 1
        else
               kill -9 $SCRIPT_SERVER_IDS
				echo "$SERVER_TAG stoped"
				return 0
		fi
}

status_server(){
        is_server_run
        if [ ! $? -eq 0 ]; then
                echo "$SERVER_NAME is not running."
        else
                echo "$SERVER_NAME is running."
		ps -ef |grep "Diname=$SERVER_TAG" | grep -v grep
        fi
}

kill_run()
{
        kill -9 $1
                return $?
}

usage_error() {
          echo "        $0 start        (start $SERVER_NAME)"
          echo "        $0 stop         (stop $SERVER_NAME)"
          echo "        $0 restart      (restart $SERVER_NAME)"
          echo "        $0 status       (list $SERVER_NAME status)"       
      exit 1
}

if [ $# -ne 1 ]; then
        usage_error
fi

#if [ "$1" = "restart" ]; then
#        set stop start
#fi 

until [ $# -eq 0 ]
do
        case $1 in
                start)
                        start_server
                        ;;
                stop)
                        kill_server
                        ;;
                status)
                        status_server
                        ;;
		restart)
			is_server_run
			if [ $? -eq 0 ]; then
				kill_server
			fi
			echo "waiting shutdown server..."
			while ["" = ""]
			do
			is_server_run
			if [ ! $? -eq 0 ]; then
				start_server
				break
			fi
			done
			;;
                *)
                        echo "unknown parameter '$1'"
        esac
shift
done

