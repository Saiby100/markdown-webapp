import requests
import unittest
import utils


class TestApi(unittest.TestCase):
    def setUp(self):
        self.URL = 'http://localhost:3000'
    
    def tearDown(self):
        URL = "http://localhost:3000"
        data = {
            'token': utils.token
        }

        response = requests.delete(URL+'/delete-username/Salahuddin', json=data)
        print(response.status_code)
    
    def test_active(self):
        # Delete users after each testcase
        response = requests.get(self.URL)

        self.assertEqual(response.status_code, 201, 'Failed test_active')
        utils.log_message(response.json())
    
    def test_register(self):
        response = utils.add_user()

        self.assertEqual(response.status_code, 201, 'Failed test_register: success')
        utils.log_message(response.json())

        response = utils.add_user('Salahuddin', 'NotSalahuddin@gmail.com')
        self.assertEqual(response.status_code, 409, 'Failed test_register: duplicate username')
        utils.log_error(response.json())

        response = utils.add_user('NotSalahuddin', 'Salahuddin@gmail.com')
        self.assertEqual(response.status_code, 409, 'Failed test_register: duplicate email')
        utils.log_error(response.json())
    
    def test_login(self):
        response = utils.add_user()
        self.assertEqual(response.status_code, 201, 'Failed test_login: create user')

        response = utils.login_user()
        self.assertEqual(response.status_code, 201, 'Failed test_login: login user')

        response = utils.login_user(password='password12')
        self.assertEqual(response.status_code, 401, 'Failed test_login: incorrect password')
    
    def test_jwt(self):
        response = utils.add_user()
        self.assertEqual(response.status_code, 201, 'Failed test_jwt: create user')
        user_id = dict(response.json())['userId']

        response = utils.login_user()
        self.assertEqual(response.status_code, 201, 'Failed test_jwt: login user')
        token = dict(response.json())['token']

        header = {
            'authorization': token
        }

        response = requests.get(self.URL+f'/get-notes/{user_id}', headers=header)
        self.assertEqual(response.status_code, 201, 'Failed test_jwt: token failed')

        header['authorization'] = header['authorization'][:-1]
        response = requests.get(self.URL+'/get-notes/{user_id}', headers=header)
        self.assertEqual(response.status_code, 403, 'Failed test_jwt: incorrect token passed')

        response = requests.get(self.URL+'/get-notes/{user_id}')
        self.assertEqual(response.status_code, 401, 'Failed test_jwt: null token passed')

    def test_add_note(self):
        response = utils.add_user()
        self.assertEqual(response.status_code, 201, 'Failed add_note: create user')
        user_id = dict(response.json())['userId']

        response = utils.login_user()
        self.assertEqual(response.status_code, 201, 'Failed add_note: login user')
        token = dict(response.json())['token']

        header = {
            'authorization': token
        }
        response = utils.add_note(header, user_id)
        self.assertEqual(response.status_code, 201, 'Failed add_note: adding first note')

        response = utils.add_note(header, user_id)
        self.assertEqual(response.status_code, 201, 'Failed add_note: adding second note')

        response = utils.add_note(header, user_id)
        self.assertEqual(response.status_code, 201, 'Failed add_note: adding third note')

    def test_delete_note(self):
        pass

    def test_get_notes(self):
        pass

    def test_update_note(self):
        pass

    def test_share_note(self):
        pass

if __name__ == '__main__':
    unittest.main()
