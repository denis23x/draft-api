.PHONY: deploy migrate seed

_REGION := asia-east1

deploy:
	gcloud builds submit --substitutions=_REGION=$(_REGION),_IMAGE_TARGET=$(target)
migrate:
	gcloud run jobs execute migrate --region $(_REGION)
seed:
	gcloud run jobs execute seed --region $(_REGION)
