# 🛟 ResQOps — Automated Deployment, Monitoring & Incident Recovery Platform

**Live demo:** http://18.60.242.119
**Monitoring:** [Prometheus](http://18.60.242.119:9090) · [Grafana](http://18.60.242.119:3030)

ResQOps is a small Node.js application wrapped in a full DevOps pipeline that
automatically builds, deploys, monitors, detects failures in, and recovers
itself — with zero manual intervention.

## What it demonstrates

- **CI/CD**: every push to `main` automatically tests, builds a Docker image, and pushes it to Docker Hub via GitHub Actions.
- **Containerization**: the app runs identically anywhere via Docker.
- **Cloud deployment**: hosted on an AWS EC2 instance, served through Nginx as a reverse proxy.
- **Monitoring**: Prometheus scrapes live app metrics (CPU, memory, request counts) every 15 seconds; Grafana visualizes them on a live dashboard.
- **Self-healing**: a Docker `HEALTHCHECK` continuously verifies the app is alive. If it fails, a background watcher script automatically restarts the container — no human involved.

## Try it live

Visit the [live dashboard](http://18.60.242.119) and click **Simulate Crash** —
watch the status flip to unhealthy, then automatically recover within ~40
seconds as the watcher script detects and restarts the container.

## Architecture

Developer → GitHub → GitHub Actions → Docker Hub → AWS EC2
↓
Nginx → Node.js App → Prometheus → Grafana
↓
Docker Healthcheck → Watcher Script
↓
Auto-restart on failure

## Tech stack

Node.js · Express · Docker · GitHub Actions · AWS EC2 · Nginx · Prometheus · Grafana
