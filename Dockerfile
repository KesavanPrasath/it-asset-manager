# Use a lightweight Python base image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy all project files into the container
COPY . .

# Install the required Python libraries
RUN pip install flask flask-cors gunicorn

# Expose port 8080 (Google Cloud Run's default port)
EXPOSE 8080

# Run the Flask app using gunicorn production server
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "backend.app:app"]