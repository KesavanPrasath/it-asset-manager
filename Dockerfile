#Python base image
FROM python:3.10-slim

#working directory inside the container
WORKDIR /app


COPY . .


RUN pip install flask flask-cors gunicorn


EXPOSE 8080

# Running Flask app using gunicorn production server
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "backend.app:app"]
