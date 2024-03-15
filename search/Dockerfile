FROM python:3.10-alpine3.16
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY src src
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=30s --start-period=30s --retries=5 \
        CMD curl http://localhost:8000/health || exit 1
ENTRYPOINT [ "python" ]
CMD [ "./src/app.py" ]