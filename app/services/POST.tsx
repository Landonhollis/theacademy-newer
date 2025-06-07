const CREATOR_PAT = 'patFtVLqn2wyEVg3Y.c9294f795d50afce5a0e38e4d3055a6156d25965416f27969cdba4e30fd0198e';
const STUDENT_PAT = 'patb3sm9ZgLoILg1G.fae4b3200406d59c093869a117f4fc252859594094bf3ed9d82a326c08760e86';
const CREATOR_BASE_ID = 'appAFJtbcvTtHsxRZ';
const STUDENT_BASE_ID = 'appZ49G62PQi1kG4X';
const CREATOR_TABLE_NAME = 'Table 1';
const STUDENT_TABLE_NAME = 'Table 1';

const CREATOR_AIRTABLE_URL = `https://api.airtable.com/v0/${CREATOR_BASE_ID}/${CREATOR_TABLE_NAME}`;
const STUDENT_AIRTABLE_URL = `https://api.airtable.com/v0/${STUDENT_BASE_ID}/${STUDENT_TABLE_NAME}`;


export interface CreatorAirtableRecord {
  fields: {
    firstName: string,
    lastName: string,
    creatorId: string,
    email: string,
    password: string,
    freeContent: any[], 
    paidContent: any[], 
  };
}

export interface StudentAirtableRecord {
  fields: {
    firstName: string,
    lastName: string,
    studentId: string,
    email: string,
    password: string,
  };
}

export async function addCreatorRecord(newRecord: CreatorAirtableRecord) {
  try {
    const response = await fetch(CREATOR_AIRTABLE_URL, {
    method: 'POST', 
    headers: {
      Authorization: `Bearer ${CREATOR_PAT}`,
      'Content-Type': 'application/json',
    }, 
    body: JSON.stringify({
      fields: newRecord.fields,
    }),
  });
  const data = await response.json();
  console.log(data);
  return data;
} catch (error) {
  console.error('Error adding creator record:', error);
}
};

export async function addStudentRecord(newRecord: StudentAirtableRecord) {
  try {
    const response = await fetch(STUDENT_AIRTABLE_URL, {
    method: 'POST', 
    headers: {
      Authorization: `Bearer ${STUDENT_PAT}`,
      'Content-Type': 'application/json',
    }, 
    body: JSON.stringify({
      fields: newRecord.fields,
    }),
  });
  const data = await response.json();
  console.log(data);
  return data;
} catch (error) {
  console.error('Error adding student record:', error);
}
};
