up:
	docker-compose up --remove-orphans
down:
	docker compose down
build:
	docker build -t draft-api:latest .
rm:
	docker rm -f app-api app-mysql
migrate:
	docker exec -it app-api sh -c 'npx prisma migrate dev'
generate:
	docker exec -it app-api sh -c 'npx prisma generate'
validate:
	docker exec -it app-api sh -c 'npx prisma validate'
seed:
	docker exec -it app-api sh -c 'npx prisma db seed'
studio:
	docker exec -it app-api sh -c 'npx prisma studio'
deploy:
	gcloud builds submit
