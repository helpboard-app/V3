# Helpboard API
# Version 3
# Powered By Deta.sh
# Built by @Brenden2008

# Import Libraries
from fastapi import FastAPI, Form
from deta import Deta
import os

# Start Common Tools
deta = Deta()
app = FastAPI()

# Start Databases
users = deta.Base("users")
boards = deta.Base("boards")
questions = deta.Base("questions")

# Start Routes
# Default Route | Displays the message below
@app.get("/")
def GetWelcomeMessage():
    return "Helpboard API Version 3.0.0 | Powered by Deta.sh!"


# User Create Route | Creates a user
@app.post("user/signup/")
async def login(username: str = Form("username"), password: str = Form("password")):
    return {"username": username}