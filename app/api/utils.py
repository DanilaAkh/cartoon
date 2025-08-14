from PIL import Image
from fastapi import UploadFile
import io
from model.model import CartoonNet


model = CartoonNet()


async def execute_request(img: UploadFile):
    contents = await img.read()    
    img = Image.open(io.BytesIO(contents))    # загрузка файла и преобразование в PIL

    prediction = model.predict(img)
    return prediction