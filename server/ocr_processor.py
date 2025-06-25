import cv2
import pytesseract
import sys
import os
import numpy as np

pytesseract.pytesseract.tesseract_cmd = r"C:\Users\Yen11\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"

image_path = sys.argv[1]

if not os.path.exists(image_path):
    print("ERROR: Image not found", file=sys.stderr)
    sys.exit(1)

image = cv2.imread(image_path)
if image is None:
    print("ERROR: Failed to read image", file=sys.stderr)
    sys.exit(1)

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

resized = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)

blurred = cv2.GaussianBlur(resized, (3, 3), 0)

_, binary = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

cv2.imwrite("debug_output_final.png", binary)

custom_config = r'--oem 3 --psm 6'

text = pytesseract.image_to_string(binary, config=custom_config, lang='eng')

print(text.strip())
