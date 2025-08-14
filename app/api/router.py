from fastapi import APIRouter, HTTPException, Request, UploadFile
from api.utils import execute_request
from fastapi.templating import Jinja2Templates


router = APIRouter(prefix='', tags=['API'])
templates = Jinja2Templates(directory='app/templates')


@router.get('/')
async def get_main_page(request: Request):
    return templates.TemplateResponse(name='index.html', context={'request': request})


@router.post('/api', summary='Основной API метод')
async def main_logic(request_img: UploadFile):
    # filename_end = request_img.filename.split(".")[-1]
    # # Чтение содержимого файла
    # contents = await request_img.read()
    
    # # Создание объекта Image из байтов
    # image = Image.open(io.BytesIO(contents))
    # image.save(f"output_test.{filename_end}")
    # return {'filename' : request_img.filename}
    try:
        prediction = await execute_request(request_img)
        return {'prediction': prediction}
    
    except Exception as e:
        HTTPException(status_code=500, detail=str(e))
