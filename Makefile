.PHONY: main serve

main:
	hugo

serve:
	hugo server

clean:
	rm -rf public
