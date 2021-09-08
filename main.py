# Helpboard API
# Version 3
# Powered By Deta.sh
# Built by @Brenden2008

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return Helpboard API Version 3.0.0 | Powered by Deta.sh!