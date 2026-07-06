import json
from django.http import JsonResponse
from django.conf import settings
from google import genai
from google.genai import types
from google.genai.errors import ClientError  # 🎯 Import the specific SDK error class

def gemini_proxy(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
        
    try:
        data = json.loads(request.body)
        transcript = data.get("transcript", "").strip() if data.get("transcript") else ""
        
        if not transcript:
            return JsonResponse({
                "candidates": [{"content": {"parts": [{"text": ""}]}}]
            })

        # Initialize the standard unified client
        api_key = getattr(settings, "API_KEY", None)
        client = genai.Client(api_key=api_key)
        
        config = types.GenerateContentConfig(
            system_instruction=(
                "You are a helpful, conversational voice assistant named Ren. "
                "Give an immediate, direct answer without conversational filler. "
                "Keep your response naturally spoken and strictly under 50 words. "
                "Do not use Markdown styling like asterisks, bold text, or lists."
            ),
            temperature=0.6,
            max_output_tokens=150,
            response_mime_type="text/plain"
        )
        
        # 🚀 PRIMARY ATTEMPT: Try the high-capacity 3.1 model first
        try:
            print("Proxy Debug: Attempting primary model (gemini-3.1-flash-lite)...")
            response = client.models.generate_content(
                model='gemini-3.1-flash-lite',
                contents=transcript,
                config=config
            )
            model_used = "gemini-3.1-flash-lite"
            
        except ClientError as ce:
            # 🔄 FALLBACK GATEWAY: Triggered if 3.1 is overloaded or down
            print(f"Proxy Warning: Primary model busy ({ce.message}). Routing to fallback...")
            response = client.models.generate_content(
                model='gemini-2.5-flash-lite',  # Swaps seamlessly to the 2.5 architecture
                contents=transcript,
                config=config
            )
            model_used = "gemini-2.5-flash-lite"

        print(f"Proxy Success: Generated reply using -> {model_used}")

        mock_response_data = {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {"text": response.text if response.text else "I am not sure how to answer that."}
                        ]
                    }
                }
            ]
        }
        
        return JsonResponse(mock_response_data)
        
    except Exception as e:
        print(f"!!! CRITICAL PROXY FAILURE: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)