from torchvision import transforms
import torch


def prepare_img(img):
    """Prepare image for model"""
    img_transforms = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])

    img = img_transforms(img)
    img = img.unsqueeze(0)
    return img


def predict_one_sample(model, inputs, device):
    
    """Predict probabilities"""
    with torch.no_grad():
        
        inputs = inputs.to(device)
        model.to(device)
        logit = model(inputs).cpu() # тут происходит ошибка

        probs = torch.nn.functional.softmax(logit, dim=-1)
    return probs