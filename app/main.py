from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from api.router import router as router_api
import uvicorn


if __name__ == '__main__':
    app = FastAPI()
    
    app.mount('/static', StaticFiles(directory='static'), 'static')
    app.include_router(router_api)


    uvicorn.run(app, host='0.0.0.0', port=8000)