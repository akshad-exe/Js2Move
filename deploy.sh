#!/bin/bash

# Js2Move Deployment Script
# This script helps deploy Js2Move to different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="js2move"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-ghcr.io}"
DOCKER_REPO="${DOCKER_REPO:-your-org/js2move}"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    if ! command -v movement &> /dev/null; then
        log_warning "Movement CLI is not installed. It will be installed in containers during build."
    fi

    log_success "Prerequisites check passed"
}

# Setup environment
setup_environment() {
    local env=$1

    log_info "Setting up environment: $env"

    # Copy environment files if they don't exist
    if [ ! -f "packages/backend/.env" ]; then
        cp packages/backend/.env.example packages/backend/.env
        log_warning "Created packages/backend/.env from example. Please configure it."
    fi

    if [ ! -f "frontend/.env" ]; then
        cp frontend/.env.example frontend/.env
        log_warning "Created frontend/.env from example. Please configure it."
    fi

    # Create necessary directories
    mkdir -p logs
    mkdir -p docker/ssl

    log_success "Environment setup completed"
}

# Build Docker images
build_images() {
    local env=$1
    local tag=${2:-latest}

    log_info "Building Docker images for $env environment..."

    # Build backend image
    log_info "Building backend image..."
    docker build -t $DOCKER_REGISTRY/$DOCKER_REPO/backend:$tag ./packages/backend

    # Build frontend image
    log_info "Building frontend image..."
    docker build -t $DOCKER_REGISTRY/$DOCKER_REPO/frontend:$tag ./frontend

    log_success "Docker images built successfully"
}

# Push images to registry
push_images() {
    local tag=${1:-latest}

    log_info "Pushing images to registry..."

    docker push $DOCKER_REGISTRY/$DOCKER_REPO/backend:$tag
    docker push $DOCKER_REGISTRY/$DOCKER_REPO/frontend:$tag

    log_success "Images pushed to registry"
}

# Deploy locally
deploy_local() {
    log_info "Deploying locally with docker-compose..."

    # Stop existing services
    docker-compose -f docker/docker-compose.yml down || true

    # Start services
    docker-compose -f docker/docker-compose.yml up -d --build

    log_success "Local deployment completed"
    log_info "Services are running on:"
    log_info "  Frontend: http://localhost:3000"
    log_info "  Backend: http://localhost:3001"
    log_info "  Database: localhost:5432"
    log_info "  Redis: localhost:6379"
}

# Deploy to production
deploy_production() {
    local tag=${1:-latest}

    log_info "Deploying to production..."

    # Export environment variables
    export DOCKER_REGISTRY=$DOCKER_REGISTRY
    export DOCKER_REPO=$DOCKER_REPO
    export IMAGE_TAG=$tag

    # Use production compose file
    docker-compose -f docker/docker-compose.prod.yml pull
    docker-compose -f docker/docker-compose.prod.yml up -d

    log_success "Production deployment completed"
}

# Show usage
usage() {
    echo "Js2Move Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  setup [dev|prod]     Setup environment files"
    echo "  build [tag]          Build Docker images"
    echo "  push [tag]           Push images to registry"
    echo "  deploy-local         Deploy locally with docker-compose"
    echo "  deploy-prod [tag]    Deploy to production"
    echo "  logs                 Show service logs"
    echo "  stop                 Stop all services"
    echo "  clean                Remove containers and volumes"
    echo ""
    echo "Examples:"
    echo "  $0 setup dev"
    echo "  $0 build v1.0.0"
    echo "  $0 deploy-local"
    echo "  $0 deploy-prod v1.0.0"
}

# Show logs
show_logs() {
    docker-compose -f docker/docker-compose.yml logs -f
}

# Stop services
stop_services() {
    log_info "Stopping services..."
    docker-compose -f docker/docker-compose.yml down
    log_success "Services stopped"
}

# Clean up
cleanup() {
    log_warning "This will remove all containers, volumes, and images"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Cleaning up..."
        docker-compose -f docker/docker-compose.yml down -v --rmi all
        docker system prune -f
        log_success "Cleanup completed"
    fi
}

# Main script
main() {
    local command=$1
    shift

    case $command in
        setup)
            check_prerequisites
            setup_environment "$1"
            ;;
        build)
            check_prerequisites
            build_images "production" "$1"
            ;;
        push)
            check_prerequisites
            push_images "$1"
            ;;
        deploy-local)
            check_prerequisites
            deploy_local
            ;;
        deploy-prod)
            check_prerequisites
            deploy_production "$1"
            ;;
        logs)
            show_logs
            ;;
        stop)
            stop_services
            ;;
        clean)
            cleanup
            ;;
        *)
            usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"