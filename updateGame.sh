PID=$(pgrep gnome-session | tail -n1)
export DBUS_SESSION_BUS_ADDRESS=$(grep -z DBUS_SESSION_BUS_ADDRESS /proc/$PID/environ|cut -d= -f2-)

export DATABASE_URL=postgresql://user_mp:v#?YERrN924ec^y+@localhost:5432/db_mon_programme
DATABASE_URL=postgresql://user_mp:v#?YERrN924ec^y+@localhost:5432/db_mon_programme
python3 /usr/local/Users/navarrete/production/scripts/updateGameFile.py