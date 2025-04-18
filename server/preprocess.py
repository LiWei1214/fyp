import cv2
import sys

def preprocess_image(input_path, output_path):
    # Read image
    image = cv2.imread(input_path, cv2.IMREAD_GRAYSCALE)

    # Apply Gaussian Blur to remove noise
    blurred = cv2.GaussianBlur(image, (5, 5), 0)

    # Apply Adaptive Thresholding to enhance text
    processed = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    # Save the processed image
    cv2.imwrite(output_path, processed)

if __name__ == "__main__":
    input_image = sys.argv[1]
    output_image = sys.argv[2]
    preprocess_image(input_image, output_image)
