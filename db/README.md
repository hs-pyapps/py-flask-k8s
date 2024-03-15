How to run your database!

Ideally everything will run via docker compose later but if for some reason you just want to run the database locally:
For the first time:
1. enter the db folder 
2. build image with "docker build -t mysql_db ."
3. run image with "docker run --name=trident_db -v $HOME/mysql-data:/var/lib/mysql -d -p 8000:3306 mysql_db" with your desired port in place of "8000"
4. you can connect via mysql workbench
After any reccuring use:
1. "docker restart trident_db"