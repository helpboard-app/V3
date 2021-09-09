# Helpboard API
# Version 3
# Powered By Deta.sh
# Built by @Brenden2008

# Import Libraries
from fastapi import FastAPI
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
    account_age: int
    description: str

# Start Routes
# Default Route | Displays the message below
@app.get("/")
def GetWelcomeMessage():
    return "Helpboard API Version 3.0.0 | Powered by Deta.sh!"


# User Create Route | Creates a user
@app.post("/user/create")
async def create_user(item: Item):
    return item