import psaas
import unittest
import json
import yaml


class TestPsaasBasic(unittest.TestCase):
        def setUp(self):
            self.app = psaas.app.test_client()
            self.app.testing = True

        # Ensure the get request is success
        def test_index_status_code(self):
            response = self.app.get('http://127.0.0.1:5000/api/v1/supplies')
            self.assertEqual(response.status_code, 200)

        # Ensure post request is success and returns the object posted
        # TO DO: currently the dev db is being used for testing as well. Need to mocdb for testing
        def test_post_request_response(self):
            def json_of_response(response):
                return yaml.safe_load(response.data)

            testObject = {"name": "test", "supply": "Ballon", "amount": 5}
            expected = {'result': testObject}

            response = self.app.post('http://127.0.0.1:5000/api/v1/supplies', data=json.dumps(testObject), content_type='application/json')

            self.assertEqual(response.status_code, 200)
            self.assertEqual(json_of_response(response), expected)


if __name__ == '__main__':
    unittest.main()
