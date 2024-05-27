.PHONY: main serve clean

main:
	hugo

serve:
	hugo server

clean:
	rm -rf public
