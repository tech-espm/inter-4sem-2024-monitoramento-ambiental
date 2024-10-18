FROM python:3.9-slim
LABEL authors="luigi"



WORKDIR /app
COPY requirements.txt /app

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app
EXPOSE 6060
ENV Name =flask

CMD ["python", "app.py"]