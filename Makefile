up:
	docker-compose up --remove-orphans
down:
	docker compose down
migrate:
	docker exec -it app-api bash -c 'npx prisma migrate dev'
seed:
	docker exec -it app-api bash -c 'npx prisma db seed'
build:
	docker build -t draft-api:latest .
rm:
	docker rm -f app-api app-mysql
studio:
	docker exec -it app-api bash -c 'npx prisma studio'
