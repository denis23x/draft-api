.PHONY: up down build rm exec deploy

up:
	docker-compose up --remove-orphans
down:
	docker compose down
build:
	docker build -t draft-api:latest .
rm:
	docker rm -f app-api app-mysql
exec:
	docker exec -it app-api sh
deploy:
	gcloud builds submit
