import * as userTypes from './userType';

const users = [{
  id: 1,
  name: 'ram',
  type: userTypes.MENTOR,
  students: [2,3],
  mentor: []
}, {
  id: 2,
  name: 'shyam',
  type: userTypes.MENTEE,
  students: [],
  mentors: [1]
}, {
  id: 3,
  name: 'gita',
  type: userTypes.MENTEE,
  students: [],
  mentors: [1]
}]

export default users;
