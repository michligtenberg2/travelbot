import unittest
from unittest.mock import patch
from app import app, get_wikipedia_summary, build_prompt


class TestApp(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()
        self.client.testing = True

    @patch('app.requests.get')
    def test_get_wikipedia_summary(self, mock_get):
        # Mock Wikipedia API response
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {
            "query": {
                "geosearch": [
                    {"title": "Test Location"}
                ]
            }
        }
        summary = get_wikipedia_summary(52.3676, 4.9041)
        self.assertIn("Test Location", summary)

    def test_build_prompt(self):
        summary = "This is a test summary."
        prompt = build_prompt(summary, question="What is this place?", style="Jordanees")
        self.assertIn("Jordaan", prompt)
        self.assertIn("What is this place?", prompt)

    def test_comment_endpoint(self):
        response = self.client.post('/comment', json={
            "lat": 52.3676,
            "lon": 4.9041,
            "style": "Jordanees"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("text", response.get_json())


if __name__ == '__main__':
    unittest.main()
