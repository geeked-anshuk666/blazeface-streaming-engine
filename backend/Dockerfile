# Use Python 3.10 slim for a balance of size and compatibility
FROM python:3.10-slim

# Install system dependencies for Mediapipe and Pillow (no-install-recommends for smaller size)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/* \
    && useradd -m -s /bin/bash appuser

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Secure container by running as non-root user
RUN chown -R appuser:appuser /app
USER appuser

# Expose standardized FastAPI port
EXPOSE 8888

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8888"]
