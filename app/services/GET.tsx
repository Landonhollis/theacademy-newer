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

export async function getRecordIdFromCreatorId(creatorId: string) {
  const response = await fetch(CREATOR_AIRTABLE_URL, {
    headers: {
      Authorization: `Bearer ${CREATOR_PAT}`,
    },
  });

  const data = await response.json();
  const record = data.records.find((record: any) => record.fields.creatorId === creatorId);
  if (!record) {
    return null; // User not found
  }
  return record.id;
}

export async function doesStudentExist(email: string, password: string): Promise<boolean> {
  const student = await fetchStudentRecord(email, password);
  const exists = student ? true : false;
  return exists;
}

export async function doesCreatorExist(email: string, password: string): Promise<boolean> {
  const creator = await fetchCreatorRecord(email, password);
  const exists = creator ? true : false;
  return exists;
}

export function doesUserExist(email: string, password: string): Promise<boolean> {
  const student = doesStudentExist(email, password);
  const creator = doesCreatorExist(email, password);
  const exists = student || creator;
  return exists;
}

export async function fetchCreatorByCreatorId(creatorId: string) {
  const response = await fetch(CREATOR_AIRTABLE_URL, {
    headers: {
      Authorization: `Bearer ${CREATOR_PAT}`,
    },
  });

  const data = await response.json();
  const creatorRecord = data.records.find(
    (record: any) => record.fields.creatorId === creatorId
  );

  if (!creatorRecord) {
    return null; // Creator not found
  }

  try {
    const returnData = {
      firstName: creatorRecord.fields.firstName,
      lastName: creatorRecord.fields.lastName,
      creatorId: creatorRecord.fields.creatorId,
      email: creatorRecord.fields.email,
      password: creatorRecord.fields.password,
      freeContent: JSON.parse(creatorRecord.fields.freeContent || '[]'),
      paidContent: JSON.parse(creatorRecord.fields.paidContent || '[]'),
    };
    return returnData;
  } catch (parseError) {
    console.error('Error parsing content for creator:', creatorRecord.fields.creatorId, parseError);
    return {
      firstName: creatorRecord.fields.firstName,
      lastName: creatorRecord.fields.lastName,
      creatorId: creatorRecord.fields.creatorId,
      email: creatorRecord.fields.email,
      password: creatorRecord.fields.password,
      freeContent: [],
      paidContent: [],
    };
  }
}

export async function fetchStudentByStudentId(studentId: string) {
  const response = await fetch(STUDENT_AIRTABLE_URL, {
    headers: {
      Authorization: `Bearer ${STUDENT_PAT}`,
    },
  });

  const data = await response.json();
  const studentRecord = data.records.find(
    (record: any) => record.fields.studentId === studentId
  );

  if (!studentRecord) {
    return null; // Student not found
  }

  const returnData = {
    firstName: studentRecord.fields.firstName,
    lastName: studentRecord.fields.lastName,
    studentId: studentRecord.fields.studentId,
    email: studentRecord.fields.email,
    password: studentRecord.fields.password,
  };

  return returnData;
}



export async function fetchCreatorRecord(username: string, password: string) {
  const response = await fetch(CREATOR_AIRTABLE_URL, {
    headers: {
      Authorization: `Bearer ${CREATOR_PAT}`,
    },
  });

  const data = await response.json();
  const creatorRecord = data.records.find((record: any) => record.fields.email === username && record.fields.password === password);
  if (!creatorRecord) {
    return null; // User not found
  }
  try {
    const returnData = {
      firstName: creatorRecord.fields.firstName,
      lastName: creatorRecord.fields.lastName,
      creatorId: creatorRecord.fields.creatorId,
      email: creatorRecord.fields.email,
      password: creatorRecord.fields.password,
      freeContent: JSON.parse(creatorRecord.fields.freeContent || '[]'),
      paidContent: JSON.parse(creatorRecord.fields.paidContent || '[]'),
    };
    return returnData;
  } catch (parseError) {
    console.error('Error parsing content for creator:', creatorRecord.fields.email, parseError);
    // Return essential data even if content parsing fails, or handle as critical error
    return {
      firstName: creatorRecord.fields.firstName,
      lastName: creatorRecord.fields.lastName,
      creatorId: creatorRecord.fields.creatorId,
      email: creatorRecord.fields.email,
      password: creatorRecord.fields.password,
      freeContent: [],
      paidContent: [],
    };
  }
}

export async function fetchStudentRecord(username: string, password: string) {
  const response = await fetch(STUDENT_AIRTABLE_URL, {
    headers: {
      Authorization: `Bearer ${STUDENT_PAT}`,
    },
  });

  const data = await response.json();
  const studentRecord = data.records.find((record: any) => record.fields.email === username && record.fields.password === password);
  if (!studentRecord) {
    return null; // User not found
  }
  // No JSON parsing needed for student, so direct return is fine
  const returnData = {
    firstName: studentRecord.fields.firstName,
    lastName: studentRecord.fields.lastName,
    studentId: studentRecord.fields.studentId,
    email: studentRecord.fields.email,
    password: studentRecord.fields.password,
  };
  return returnData;
}



export async function fetchCreatorApp(appId: string, recordId: string, appIsPaid: boolean) {
  try {
    // Fetch the creator record using the record ID
    const response = await fetch(`${CREATOR_AIRTABLE_URL}/${recordId}`, {
      headers: {
        Authorization: `Bearer ${CREATOR_PAT}`,
      },
    });

    const data = await response.json();
    
    // Check if we got a valid record
    if (!data || !data.fields) {
      console.error('Invalid Airtable response:', data);
      return null;
    }

    // Get the appropriate content array based on whether app is paid or free
    const contentArray = appIsPaid ? 
      JSON.parse(data.fields.paidContent || '[]') :
      JSON.parse(data.fields.freeContent || '[]');

    // Find the specific app in the content array
    const app = contentArray.find((app: any) => app.appId === appId);

    if (!app) {
      console.error(`App not found for appId: ${appId}`);
      return null;
    }

    return app;
  } catch (error) {
    console.error('Error fetching creator app:', error);
    return null;
  }
}