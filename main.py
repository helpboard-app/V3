# Helpboard API
# Version 3
# Powered By Deta.sh
# Built by @Brenden2008

# Import Libraries
from fastapi import FastAPI, Form, Response
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
sessions = deta.Base("sessions")
userdata = deta.Base("userdata")

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
async def create_user(user: User, response: Response):
    if users.get(user.username) != user.username:
        session_key = random.randrange(0000000, 9999999, 3)
        try:
            users.put({"username": user.username, "password": user.password, "email": user.email}, user.username)
            sessions.put({"session_key": session_key}, user.username)
        except:
            return "Failed to make user"
        else:
            
            return "Success"
    else:
        return "User exists"


# User Read Route | Get user data
@app.post("/user/login")
async def login_user(user: User, response: Response):
    session_key = random.randrange(0000000, 9999999, 3)
    try:
        if users.get(user.username).password == user.password and users.get(user.username).username == user.username:
            sessions.put({"session_key": session_key}, user.username)
    except:
        return "Failed to login user"
    else:
        response.set_cookie(key="session_key", value=session_key)
        response.set_cookie(key="username", value=user.username)
        return "Success"