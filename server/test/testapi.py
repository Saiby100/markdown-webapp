import requests
import unittest
import utils


class TestApi(unittest.TestCase):
    def setUp(self):
        self.URL = 'http://localhost:8000'
    
    def tearDown(self):
        URL = "http://localhost:8000"
        data = {
            'token': utils.token
        }

        requests.delete(URL+'/delete-username/Salahuddin', json=data)
        requests.delete(URL+'/delete-username/Sala', json=data)
    
    def test_active(self):
        # Delete users after each testcase
        response = requests.get(self.URL)

        self.assertEqual(response.status_code, 201, 'Failed test_active')
        utils.log_message(response.json())
    
    def test_register(self):
        print('TESTING REGISTER')
        response = utils.add_user()

        self.assertEqual(response.status_code, 201, 'Failed test_register: success')

        response = utils.add_user('Salahuddin', 'NotSalahuddin@gmail.com')
        self.assertEqual(response.status_code, 409, 'Failed test_register: duplicate username')

        response = utils.add_user('NotSalahuddin', 'Salahuddin@gmail.com')
        self.assertEqual(response.status_code, 409, 'Failed test_register: duplicate email')
    
    def test_login(self):
        print('TESTING LOGIN')
        response = utils.add_user()
        self.assertEqual(response.status_code, 201, 'Failed test_login: create user')

        response = utils.login_user()
        self.assertEqual(response.status_code, 201, 'Failed test_login: login user')

        response = utils.login_user(password='password12')
        self.assertEqual(response.status_code, 401, 'Failed test_login: incorrect password')
    
    def test_jwt(self):
        print('TESTING JWT')
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
        print('TESTING ADD_NOTE')
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

    def test_update_note(self):
        print('TESTING UPDATE_NOTE')
        response = utils.add_user()
        self.assertEqual(response.status_code, 201, 'Failed update_note: create user')
        user_id = dict(response.json())['userId']

        response = utils.login_user()
        self.assertEqual(response.status_code, 201, 'Failed update_note: login user')
        token = dict(response.json())['token']

        header = {
            'authorization': token
        }
        response = utils.add_note(header, user_id)
        self.assertEqual(response.status_code, 201, 'Failed update_note: adding first note')
        note_id = dict(response.json())['noteId']

        data = {
            'title': 'This title was updated',
            'text': 'This note text was updated.'
        }
        response = requests.put(self.URL+f'/update-note/{note_id}', headers=header, json=data)
        self.assertEqual(response.status_code, 201, 'Failed update_note: update note failed')

        response = requests.put(self.URL+f'/update-note/{-1}', headers=header, json=data)
        self.assertEqual(response.status_code, 404, 'Failed update_note: note found for unknown id')

    def test_get_notes(self):
        print('TESTING GET_NOTES')
        response = utils.add_user()
        self.assertEqual(response.status_code, 201, 'Failed get_notes: create user')
        user_id = dict(response.json())['userId']

        response = utils.login_user()
        self.assertEqual(response.status_code, 201, 'Failed get_notes: login user')
        token = dict(response.json())['token']

        header = {
            'authorization': token
        }
        response = utils.add_note(header, user_id)
        self.assertEqual(response.status_code, 201, 'Failed get_notes: adding first note')

        response = utils.add_note(header, user_id)
        self.assertEqual(response.status_code, 201, 'Failed get_notes: adding second note')

        response = utils.add_note(header, user_id)
        self.assertEqual(response.status_code, 201, 'Failed get_notes: adding third note')

        response = requests.get(self.URL+f'/get-notes/{user_id}', headers=header)
        self.assertEqual(response.status_code, 201, 'Failed get_notes: fetching notes')
        self.assertEqual(len(list(response.json())), 3, 'Failed get_notes: notes amount not matching')


    def test_share_note(self):
        print('TESTING SHARE_NOTE')
        user_ids = []
        tokens = []

        # Create Users
        response = utils.add_user()
        self.assertEqual(response.status_code, 201, 'Failed share_note: create user')
        user_ids.append(dict(response.json())['userId'])

        response = utils.add_user('Sala', 'Sala@gmail.com')
        self.assertEqual(response.status_code, 201, 'Failed share_note: create second user')
        user_ids.append(dict(response.json())['userId'])

        # Login Users
        response = utils.login_user()
        self.assertEqual(response.status_code, 201, 'Failed share_note: login user')
        tokens.append(dict(response.json())['token'])

        response = utils.login_user('Sala')
        self.assertEqual(response.status_code, 201, 'Failed share_note: login second user')
        tokens.append(dict(response.json())['token'])

        # Create notes
        headers = [
            {'authorization': tokens[0]},
            {'authorization': tokens[1]}
        ]

        response = utils.add_note(headers[0], user_ids[0])
        note_id = dict(response.json())['noteId']
        response = utils.add_note(headers[1], user_ids[1])

        # Share first user's note to second user
        data = {
            'user1': user_ids[0],
            'user2': user_ids[1],
            'noteId': note_id
        }

        response = requests.post(self.URL+'/share-note', headers=headers[0], json=data)
        self.assertEqual(response.status_code, 201, 'Failed share_note: share note')

        # Check amount of second user's note
        response = requests.get(self.URL+f'/get-notes/{user_ids[1]}', headers=headers[1])
        self.assertEqual(response.status_code, 201, 'Failed share_note: failed to fetch notes')
        self.assertEqual(len(list(response.json())), 2, 'Failed share_note: incorrect note amount')

        # Delete shared note from second user
        response = requests.delete(self.URL+f'/delete-note/{note_id}/{user_ids[1]}', headers=headers[1])
        self.assertEqual(response.status_code, 201, 'Failed share_note: shared note not deleted')

        # Checking note still exists for original (first) user
        response = requests.get(self.URL+f'/get-notes/{user_ids[0]}', headers=headers[0])
        self.assertEqual(response.status_code, 201, 'Failed share_note: failed to fetch notes 2')
        self.assertEqual(len(list(response.json())), 1, 'Failed share_note: incorrect note amount')

    def test_delete_note(self):
        print('TESTING DELETE_NOTE')
        response = utils.add_user()
        self.assertEqual(response.status_code, 201, 'Failed delete_note: create user')
        user_id = dict(response.json())['userId']

        response = utils.login_user()
        self.assertEqual(response.status_code, 201, 'Failed delete_note: login user')
        token = dict(response.json())['token']

        header = {
            'authorization': token
        }
        response = utils.add_note(header, user_id)
        self.assertEqual(response.status_code, 201, 'Failed delete_note: adding first note')
        note_id = dict(response.json())['noteId']

        response = requests.delete(self.URL+f'/delete-note/{note_id}/{user_id}', headers=header)
        self.assertEqual(response.status_code, 201, 'Failed delete_note: deleting note')

        response = requests.delete(self.URL+f'/delete-note/{note_id}/{user_id}', headers=header)
        self.assertEqual(response.status_code, 404, 'Failed delete_note: note found after deletion')

if __name__ == '__main__':
    unittest.main()
