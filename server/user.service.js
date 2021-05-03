import users from './users';
import * as userTypes from './userType';

export function findUserById(id) {
  const user = users.find(user => user.id === id);
  return user || {}
}

export function validateRelationship(user1_id, user2_id) {
  const user1 = findUserById(user1_id);
  const user2 = findUserById(user2_id);

  if (!user1 || !user2 ) return false;

  if (user1.type === userTypes.MENTOR) {
    return user1.students.includes(user2.id)
  } else if (user1.type === userTypes.MENTEE) {
    return user1.mentors.includes(user2.id)
  } else {
    return false
  }
}