.PHONY: help install dev start stop build preview serve clean clean-all

# Ports
PORT_DEV     := 4321
PORT_PREVIEW := 4321
PID_FILE     := .dev.pid

## help        Muestra esta ayuda
help:
	@echo ""
	@echo "  Optim Landing — comandos disponibles"
	@echo ""
	@grep -E '^## ' Makefile | sed 's/## /  make /'
	@echo ""

## install     Instala las dependencias (npm install)
install:
	npm install

## dev         Arranca el servidor de desarrollo en primer plano (Ctrl+C para parar)
dev:
	npm run dev

## start       Arranca el servidor de desarrollo en segundo plano
start:
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		echo "El servidor ya esta corriendo (PID $$(cat $(PID_FILE)))"; \
	else \
		npm run dev > .dev.log 2>&1 & echo $$! > $(PID_FILE); \
		sleep 2; \
		echo "Servidor iniciado en http://localhost:$(PORT_DEV) (PID $$(cat $(PID_FILE)))"; \
		echo "Logs: make logs"; \
	fi

## stop        Para el servidor de desarrollo en segundo plano
stop:
	@if [ -f $(PID_FILE) ]; then \
		PID=$$(cat $(PID_FILE)); \
		kill $$PID 2>/dev/null && echo "Servidor parado (PID $$PID)" || echo "El proceso ya no estaba corriendo"; \
		rm -f $(PID_FILE); \
	else \
		lsof -ti :$(PORT_DEV) | xargs kill -9 2>/dev/null && echo "Servidor parado" || echo "No habia ningun servidor corriendo en :$(PORT_DEV)"; \
	fi

## logs        Muestra los logs del servidor en segundo plano (tail -f)
logs:
	@tail -f .dev.log

## build       Genera la build de produccion en dist/
build:
	npm run build

## preview     Genera la build y arranca el servidor de preview en primer plano
preview: build
	npm run preview

## serve       Sirve dist/ con npx serve (util si ya tienes la build)
serve:
	npx serve dist -p 3000

## clean       Elimina la carpeta dist/
clean:
	rm -rf dist .astro

## clean-all   Elimina dist/, node_modules y logs
clean-all: clean
	rm -rf node_modules .dev.log .dev.pid
