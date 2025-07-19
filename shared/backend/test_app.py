import unittest
from unittest.mock import patch, MagicMock
import os
import json


class TestApp(unittest.TestCase):

    def setUp(self):
        # Set environment variables before importing app
        os.environ['OPENAI_API_KEY'] = 'test_key'
        os.environ['ADMIN_USERNAME'] = 'test_admin'
        os.environ['ADMIN_PASSWORD'] = 'test_password'
        
        # Import app after setting environment variables
        from app import app, get_wikipedia_summary, build_prompt
        self.app = app
        self.get_wikipedia_summary = get_wikipedia_summary
        self.build_prompt = build_prompt
        
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()

    def tearDown(self):
        # Clean up environment variables
        if 'OPENAI_API_KEY' in os.environ:
            del os.environ['OPENAI_API_KEY']
        if 'ADMIN_USERNAME' in os.environ:
            del os.environ['ADMIN_USERNAME']
        if 'ADMIN_PASSWORD' in os.environ:
            del os.environ['ADMIN_PASSWORD']

    def test_build_prompt_jordanees(self):
        """Test building prompt with Jordanees style"""
        summary = "This is a test summary."
        prompt = self.build_prompt(summary, question="What is this place?", style="Jordanees")
        self.assertIn("Jordaan", prompt)
        self.assertIn("What is this place?", prompt)
        self.assertIn("test summary", prompt)

    def test_build_prompt_belg(self):
        """Test building prompt with Belgian style"""
        summary = "Test location summary."
        prompt = self.build_prompt(summary, style="Belg")
        self.assertIn("Belg", prompt)
        self.assertIn("Antwerpen", prompt)

    def test_build_prompt_brabander(self):
        """Test building prompt with Brabander style"""
        summary = "Test location summary."
        prompt = self.build_prompt(summary, style="Brabander")
        self.assertIn("Brabander", prompt)
        self.assertIn("zachte G", prompt)

    def test_build_prompt_without_question(self):
        """Test building prompt without question"""
        summary = "Test summary without question."
        prompt = self.build_prompt(summary)
        self.assertIn("humoristische zin", prompt)
        self.assertNotIn("vraagt je:", prompt)

    def test_comment_endpoint_missing_coordinates(self):
        """Test comment endpoint with missing coordinates"""
        response = self.client.post('/comment', 
                                  json={"lat": 52.3676},
                                  headers={'X-API-KEY': 'test_key'})
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertIn("error", data)

    def test_comment_endpoint_missing_api_key(self):
        """Test comment endpoint without API key"""
        response = self.client.post('/comment', 
                                  json={"lat": 52.3676, "lon": 4.9041})
        self.assertEqual(response.status_code, 401)
        data = response.get_json()
        self.assertIn("API key is required", data["error"])

    def test_login_valid_credentials(self):
        """Test login with valid credentials"""
        response = self.client.post('/login', 
                                  json={"username": "test_admin", "password": "test_password"},
                                  headers={'X-API-KEY': 'test_key'})
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("token", data)

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = self.client.post('/login', 
                                  json={"username": "wrong", "password": "wrong"},
                                  headers={'X-API-KEY': 'test_key'})
        self.assertEqual(response.status_code, 401)
        data = response.get_json()
        self.assertIn("Invalid credentials", data["error"])

    def test_admin_login_valid_credentials(self):
        """Test admin login with valid credentials"""
        response = self.client.post('/admin-login', 
                                  json={"username": "test_admin", "password": "test_password"},
                                  headers={'X-API-KEY': 'test_key'})
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("token", data)

    def test_admin_login_invalid_credentials(self):
        """Test admin login with invalid credentials"""
        response = self.client.post('/admin-login', 
                                  json={"username": "wrong", "password": "wrong"},
                                  headers={'X-API-KEY': 'test_key'})
        self.assertEqual(response.status_code, 401)

    def test_load_persona_not_found(self):
        """Test loading non-existent persona"""
        response = self.client.get('/load-persona/nonexistent', headers={'X-API-KEY': 'test_key'})
        self.assertEqual(response.status_code, 404)
        data = response.get_json()
        self.assertIn("Persona not found", data["error"])

    def test_upload_persona_missing_data(self):
        """Test uploading persona with missing data"""
        persona_data = {"name": "test_persona"}  # Missing description
        
        response = self.client.post('/upload-persona', 
                                  json=persona_data,
                                  headers={'X-API-KEY': 'test_key'})
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertIn("Name and description are required", data["error"])


if __name__ == '__main__':
    unittest.main()
