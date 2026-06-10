# Use a stable Python base image for consistent execution environment
FROM python:3.10-slim

# Set working directory inside the container
WORKDIR /app

# Copy and install dependencies first to leverage Docker caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the core application scripts
COPY scripts/test_playbook_runner.py .
COPY scripts/api_service.py . # 가상의 API 서비스 파일도 함께 복사한다고 가정

# Command to run the test suite when the container starts
ENTRYPOINT ["python", "test_playbook_runner.py"]