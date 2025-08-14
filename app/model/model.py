import torch
import torchvision
from model.utils import prepare_img, predict_one_sample
import numpy as np


DEVICE = 'cpu' # 'cuda' if torch.cuda.is_available() else 

class CartoonNet():
    def __init__(self, n_classes=10):
        print('loading model')
        
        # prepare and load model
        self.model = torchvision.models.resnet18()

        print("Seting parameters...")
        n_fc_in = self.model.fc.in_features
        self.model.fc = torch.nn.Linear(n_fc_in, n_classes)
        self.model.load_state_dict(torch.load('app/ckpt/best_model.pt', map_location=torch.device('cpu')))

        print("Seting on evaluation mode...")
        self.model.eval()

    def predict(self, image):
        img = prepare_img(image)
        proba = predict_one_sample(self.model, img, device=DEVICE)
        names_classes = ['Familyguy', 'Gumball', 'Tsubasa', 'adventure_time', 'catdog', 'pokemon', 'smurfs', 'southpark', 'spongebob', 'tom_and_jerry']
        #predicted_proba = np.max(proba) * 100

        predicted_class_idx = torch.argmax(proba).item()
        predicted_class_name = names_classes[predicted_class_idx]
        
        return predicted_class_name #[predicted_class_name, predicted_proba]