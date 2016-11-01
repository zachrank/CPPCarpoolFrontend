# compile the front end js and css
compile:
	#rm -rf node_modules
	docker build -t carpool-build -f Dockercompile .
	docker rm -f carpool-build &> /dev/null || true
	docker run --name carpool-build carpool-build
	docker cp carpool-build:/data/static .
	docker rm -f carpool-build

# build the webserver container
build: stop compile
	docker build -t cppcarpool-frontend .

net:
	docker network ls | grep cppcarpool || docker network create cppcarpool

# run the webserver (production mode, does not compile)
run: net
	docker run -d --name=cppcarpool-frontend --net=cppcarpool -p 80:80 -v `pwd`/static:/usr/share/nginx/html cppcarpool-frontend

stop:
	-docker stop cppcarpool-frontend
	-docker rm cppcarpool-frontend

# run the server and watch source files for changes
dev: net
	#run nginx container in background
	docker run --name carpool-nginx --net=cppcarpool -d -p 8000:80 -v `pwd`/static:/usr/share/nginx/html -v `pwd`/nginx-dev.conf:/etc/nginx/conf.d/default.conf cppcarpool-frontend
	#run build container
	-docker run -v `pwd`:/data --rm -it digitallyseamless/nodejs-bower-grunt:0.12 /bin/bash -c "npm install --unsafe-perm; grunt dev"
	docker stop carpool-nginx
	docker rm carpool-nginx
