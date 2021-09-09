# Helpboard API
# Version 3
# Powered By Deta.sh
# Built by @Brenden2008

# Import Libraries
from fastapi import FastAPI, Form
from deta import Deta
import os
from pydantic import BaseModel

# Start Common Tools
deta = Deta()
app = FastAPI()

# Start Databases
users = deta.Base("users")
boards = deta.Base("boards")
questions = deta.Base("questions")

# Declare Pydantic Models
class User(BaseModel):
    username: str
    password: str
    email: str

# Start Routes
# Default Route | Displays the message below
@app.get("/")
def Home_Page():
    return "Helpboard API Version 3.0.0 | Powered by Deta.sh!"


# User Create Route | Creates a user
@app.post("/user/create")
async def create_user(user: User):
    try:
        users.put({"username": user.username, "password": user.password, "email": user.email}, user.username)
    except:
        return {success: 0}
    else:
        return {success: 1}