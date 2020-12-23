sudo pkill node
sleep 1.99
cd /home/pi/Scrollup_Manager/ # go folder
chmod +x player.sh
lxterminal -e "./player.sh"
sleep 5.99
git fetch --all # check update
git reset --hard origin/master # pull update and ignore stash
npm install # install dependecies
npm start # run player
npm start # run again if something fail on player
npm start # run again if something fail on player
npm start # run again if something fail on player
npm start # run again if something fail on player
npm start # run again if something fail on player