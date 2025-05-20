import cv2
import numpy as np
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status

@api_view(['POST'])
@parser_classes([MultiPartParser])
def rate_face(request):
    image_file = request.FILES.get('image')
    
    if not image_file:
        return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Convert uploaded image to a NumPy array
        file_bytes = np.frombuffer(image_file.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        # Validate image
        if img is None:
            return Response({'error': 'Invalid image file'}, status=status.HTTP_400_BAD_REQUEST)

        # Example scoring logic: average brightness
        avg_brightness = int(np.mean(img))

        # Normalize brightness to a 1–10 scale
        score = round((avg_brightness / 255) * 9 + 1, 2)

        return Response({'score': score})

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
