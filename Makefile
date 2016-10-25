compile:
	docker build -t carpool-build -f Dockercompile .
	docker rm -f carpool-build &> /dev/null || true
	docker run --name carpool-build carpool-build
	docker cp carpool-build:/data/static .
	docker rm -f carpool-build

dev:
	cd static; python -m SimpleHTTPServer 8080
