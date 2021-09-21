OPTIONS:=--allow-read --allow-net --import-map ./import_map.json

all: compile

test:
	deno test $(OPTIONS) --allow-write
compile:
	deno compile $(OPTIONS) cli.ts
lint:
	deno lint
run:
	deno run $(OPTIONS) cli.ts
