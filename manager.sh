sleep 2.99
cd /home/pi/Scrollup_Manager/ # go folder
chmod +x player.sh
lxterminal -e "./player.sh"
git fetch --all # check update
git reset --hard origin/master # pull update and ignore stash
npm install # install dependecies
npm start # run player
npm start # run again if something fail on player
npm start # run again if something fail on player
npm start # run again if something fail on player
npm start # run again if something fail on player
npm start # run again if something fail on player