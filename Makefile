NAME = cppcarpool-frontend
VERSION ?= latest

# compile the front end js and css
compile:
	#rm -rf node_modules
	docker build -t carpool-build -f Dockercompile .
	docker rm -f carpool-build &> /dev/null || true
	docker run --name carpool-build carpool-build
	docker cp carpool-build:/data/static .
	docker rm -f carpool-build

# build the webserver container
build:
	docker build -t $(NAME):$(VERSION) .

# run the webserver (production mode, does not compile)
run:
	docker run --rm -it -p 80:80 --rm $(NAME):$(VERSION)

# run the server and watch source files for changes
dev:
	#run nginx container in background
	docker run --name carpool-nginx -d -p 8080:80 -v `pwd`/static:/usr/share/nginx/html -v `pwd`/nginx-dev.conf:/etc/nginx/conf.d/default.conf $(NAME):$(VERSION)
	#run build container
	-docker run -v `pwd`:/data --rm -it digitallyseamless/nodejs-bower-grunt:0.12 /bin/bash -c "npm install --unsafe-perm; grunt dev"
	docker stop carpool-nginx
	docker rm carpool-nginx
