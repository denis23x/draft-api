.PHONY: deploy migrate seed

REGION := asia-east1
TARGET := migrate

deploy:
	gcloud builds submit --substitutions=_REGION=$(REGION),_TARGET=$(TARGET)
migrate:
	gcloud run jobs execute migrate --region $(REGION)
seed:
	gcloud run jobs execute seed --region $(REGION)
