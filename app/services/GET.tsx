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


export async function getRecordIdFromStudentId(studentId: string): Promise<string | null> {
  try {
    const response = await fetch(`${STUDENT_AIRTABLE_URL}?filterByFormula={studentId}='${studentId}'`, {
      headers: {
        Authorization: `Bearer ${STUDENT_PAT}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.records || data.records.length === 0) {
      console.log('No student record found:', data);
      return null;
    }

    return data.records[0].id;
  } catch (error) {
    console.error('Error getting record ID:', error);
    return null;
  }
}

export async function getStudentInformation(studentId: string) {
  try {
    console.log("getting student information");
    
    // First get the Airtable record ID
    const recordId = await getRecordIdFromStudentId(studentId);
    if (!recordId) {
      console.log('No record ID found for student:', studentId);
      return null;
    }

    // Then fetch the record using the record ID
    const response = await fetch(`${STUDENT_AIRTABLE_URL}/${recordId}`, {
      headers: {
        Authorization: `Bearer ${STUDENT_PAT}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle empty response or missing fields
    if (!data || !data.fields) {
      console.log('No fields found in response:', data);
      return null;
    }

    // Handle empty arrays
    const studentData = {
      ...data,
      fields: {
        ...data.fields,
        freeFollowing: data.fields.freeFollowing || '[]',
        paidFollowing: data.fields.paidFollowing || '[]'
      }
    };

    console.log('Student data fetched:', studentData);
    return studentData;
  } catch (error) {
    console.error('Error fetching student information:', error);
    return null;
  }
}



export async function getFreeFollowing(studentId: string): Promise<CreatorAirtableRecord[]> {
  try {
    // Get the student record to get their freeFollowing array
    const response = await fetch(`${STUDENT_AIRTABLE_URL}?filterByFormula={studentId}='${studentId}'`, {
      headers: { Authorization: `Bearer ${STUDENT_PAT}` },
    });
    const data = await response.json();

    if (!data.records || data.records.length === 0) {
      throw new Error('Student not found');
    }

    // Get the freeFollowing array from the student record
    const freeFollowingIds = JSON.parse(data.records[0].fields.freeFollowing || '[]') as string[];

    // If no creators are being followed, return empty array
    if (freeFollowingIds.length === 0) return [];

    // Create Airtable filter formula
    const filterFormula = freeFollowingIds.map((id: string) => `{creatorId}='${id}'`).join(' OR ');
    const creatorResponse = await fetch(`${CREATOR_AIRTABLE_URL}?filterByFormula=${encodeURIComponent(filterFormula)}`, {
      headers: { Authorization: `Bearer ${CREATOR_PAT}` },
    });
    const creatorData = await creatorResponse.json();

    // Return the creator records
    return creatorData.records.map((record: any) => ({
      id: record.id,
      fields: record.fields
    }));
  } catch (error) {
    console.error('Error fetching free following creators:', error);
    throw error;
  }
}

export async function getPaidFollowing(studentId: string): Promise<CreatorAirtableRecord[]> {
  try {
    // Get the student record to get their paidFollowing array
    const response = await fetch(`${STUDENT_AIRTABLE_URL}?filterByFormula={studentId}='${studentId}'`, {
      headers: { Authorization: `Bearer ${STUDENT_PAT}` },
    });
    const data = await response.json();

    if (!data.records || data.records.length === 0) {
      throw new Error('Student not found');
    }

    // Get the paidFollowing array from the student record
    const paidFollowingIds = JSON.parse(data.records[0].fields.paidFollowing || '[]') as string[];

    // If no creators are being followed, return empty array
    if (paidFollowingIds.length === 0) return [];

    // Create Airtable filter formula
    const filterFormula = paidFollowingIds.map((id: string) => `{creatorId}='${id}'`).join(' OR ');
    const creatorResponse = await fetch(`${CREATOR_AIRTABLE_URL}?filterByFormula=${encodeURIComponent(filterFormula)}`, {
      headers: { Authorization: `Bearer ${CREATOR_PAT}` },
    });
    const creatorData = await creatorResponse.json();

    // Return the creator records
    return creatorData.records.map((record: any) => ({
      id: record.id,
      fields: record.fields
    }));
  } catch (error) {
    console.error('Error fetching paid following creators:', error);
    throw error;
  }
}



export async function searchCreators(searchQuery: string): Promise<CreatorAirtableRecord[]> {
  try {
    // If search query is empty, return all creators
    const formula = searchQuery ? 
      `OR(FIND('${searchQuery.toLowerCase()}', LOWER({firstName})), FIND('${searchQuery.toLowerCase()}', LOWER({lastName})))` :
      '1=1';  // Return all records when empty

    // Fetch creators that match the search query
    const response = await fetch(`${CREATOR_AIRTABLE_URL}?filterByFormula=${encodeURIComponent(formula)}`, {
      headers: {
        Authorization: `Bearer ${CREATOR_PAT}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.records) {
      throw new Error('Invalid response format');
    }

    // Return the matching creators
    return data.records.map((record: any) => ({
      id: record.id,
      fields: record.fields
    }));
  } catch (error) {
    console.error('Error searching creators:', error);
    throw error;
  }
}