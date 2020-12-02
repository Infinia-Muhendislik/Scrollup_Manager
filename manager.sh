sleep 2.99
cd /home/pi/Scrollup_Manager/ # go folder
git fetch --all # check update
git reset --hard origin/master # pull update and ignore stash
npm install # install dependecies
lxterminal -e "./player.sh"
npm start # run player
npm start # run again if something fail on player
npm start # run again if something fail on player
# Manager aşağıdaki komutları çalıştıracak