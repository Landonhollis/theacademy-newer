import { fetchCreatorByCreatorId, fetchStudentByStudentId, fetchCreatorApp } from "./GET";

export interface App {
  title: string;
  description: string;
  content: string;
  appId: string;
}

interface ContentItem {
  title: string;
  description: string;
  body: string;
}

const CREATOR_PAT = 'patFtVLqn2wyEVg3Y.c9294f795d50afce5a0e38e4d3055a6156d25965416f27969cdba4e30fd0198e';
const STUDENT_PAT = 'patb3sm9ZgLoILg1G.fae4b3200406d59c093869a117f4fc252859594094bf3ed9d82a326c08760e86';
const CREATOR_BASE_ID = 'appAFJtbcvTtHsxRZ';
const STUDENT_BASE_ID = 'appZ49G62PQi1kG4X';
const CREATOR_TABLE_NAME = 'Table 1';
const STUDENT_TABLE_NAME = 'Table 1';

const CREATOR_AIRTABLE_URL = `https://api.airtable.com/v0/${CREATOR_BASE_ID}/${CREATOR_TABLE_NAME}`;
const STUDENT_AIRTABLE_URL = `https://api.airtable.com/v0/${STUDENT_BASE_ID}/${STUDENT_TABLE_NAME}`;

export interface App {
  title: string;
  description: string;
  content: string;
  appId: string;
}

export async function addFreeApp(userId: string, recordId: string, app: App) {
  const creatorData = await fetchCreatorByCreatorId(userId);
  const existingFreeApps = Array.isArray(creatorData?.freeContent)
  ? creatorData.freeContent.flat()
  : [];
  const updatedFreeApps = [...existingFreeApps, app];
  const updatedFreeAppsString = JSON.stringify(updatedFreeApps);


  const response = await fetch(CREATOR_AIRTABLE_URL + `/${recordId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${CREATOR_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        freeContent: updatedFreeAppsString,
      },
    })
  });

  const data = await response.json();
  console.log(data);
  return data;
}


export async function addPaidApp(userId: string, recordId: string, app: App) {
  const creatorData = await fetchCreatorByCreatorId(userId);
  console.log("creator data", creatorData);
  console.log("type of creator data", typeof creatorData);
  const existingPaidApps = Array.isArray(creatorData?.paidContent)
  ? creatorData.paidContent.flat()
  : [];

  const updatedPaidApps = [...existingPaidApps, app];
  console.log(updatedPaidApps);
  console.log("type of updated paid apps", typeof updatedPaidApps);
  const updatedPaidAppsString = JSON.stringify(updatedPaidApps);
  console.log(updatedPaidAppsString);
  console.log("type of updated paid apps string", typeof updatedPaidAppsString);


  const response = await fetch(CREATOR_AIRTABLE_URL + `/${recordId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${CREATOR_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        paidContent: updatedPaidAppsString,
      },
    })
  });

  const data = await response.json();
  console.log(data);
  return data;
}
  

export async function deleteFreeApp(userId: string, recordId: string, appId: string) {
  const creatorData = await fetchCreatorByCreatorId(userId);
  const existingFreeApps = Array.isArray(creatorData?.freeContent)
  ? creatorData.freeContent.flat()
  : [];

  const updatedFreeApps = existingFreeApps.filter((app) => app.appId !== appId);
  const updatedFreeAppsString = JSON.stringify(updatedFreeApps);

  const response = await fetch(CREATOR_AIRTABLE_URL + `/${recordId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${CREATOR_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        freeContent: updatedFreeAppsString,
      },
    })
  });

  const data = await response.json();
  console.log(data);
  return data;
}
  
export async function deletePaidApp(userId: string, recordId: string, appId: string) {
  const creatorData = await fetchCreatorByCreatorId(userId);
  const existingPaidApps = Array.isArray(creatorData?.paidContent)
  ? creatorData.paidContent.flat()
  : [];

  const updatedPaidApps = existingPaidApps.filter((app) => app.appId !== appId);
  const updatedPaidAppsString = JSON.stringify(updatedPaidApps);

  const response = await fetch(CREATOR_AIRTABLE_URL + `/${recordId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${CREATOR_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        paidContent: updatedPaidAppsString,
      },
    })
  });

  const data = await response.json();
  console.log(data);
  return data;
}

export async function updateCreatorRecord(recordId: string, data: { fields: any }) {
  try {
    const response = await fetch(`${CREATOR_AIRTABLE_URL}/${recordId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${CREATOR_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedRecord = await response.json();
    return updatedRecord;
  } catch (error) {
    console.error('Error updating creator record:', error);
    throw error;
  }
}

export async function addContentToApp(appIsPaid: boolean, appId: string, recordId: string, contentId: string, title: string, description: string, body: string) {
  try {
    // First fetch the creator record
    const response = await fetch(`${CREATOR_AIRTABLE_URL}/${recordId}`, {
      headers: {
        Authorization: `Bearer ${CREATOR_PAT}`,
      },
    });

    const data = await response.json();
    
    // Get the appropriate content array based on whether app is paid or free
    const contentArray = appIsPaid ? 
      JSON.parse(data.fields.paidContent || '[]') :
      JSON.parse(data.fields.freeContent || '[]');

    // Find the specific app in the content array
    const appIndex = contentArray.findIndex((app: any) => app.appId === appId);
    if (appIndex === -1) {
      throw new Error(`App with ID ${appId} not found`);
    }

    // Create the new content item
    const newContentItem = {
      title,
      description,
      body, 
      contentId,
    };

    // Update the app's content array
    const updatedApp = {
      ...contentArray[appIndex],
      content: [...(contentArray[appIndex].content || []), newContentItem]
    };

    // Create the new content array with the updated app
    const updatedContentArray = [
      ...contentArray.slice(0, appIndex),
      updatedApp,
      ...contentArray.slice(appIndex + 1)
    ];

    // Prepare the update data
    const updateData = {
      fields: {
        ...(appIsPaid ? { paidContent: JSON.stringify(updatedContentArray) } : { freeContent: JSON.stringify(updatedContentArray) })
      }
    };

    // Update the creator record with the new content
    await updateCreatorRecord(recordId, updateData);

    return {
      success: true,
      message: 'Content added successfully'
    };
  } catch (error) {
    console.error('Error adding content:', error);
    throw error;
  }
}

export async function deleteContent(appIsPaid: boolean, appId: string, recordId: string, contentId: string) {
  try {
    // First fetch the creator record
    const response = await fetch(`${CREATOR_AIRTABLE_URL}/${recordId}`, {
      headers: {
        Authorization: `Bearer ${CREATOR_PAT}`,
      },
    });

    const data = await response.json();
    
    // Get the appropriate content array based on whether app is paid or free
    const contentArray = appIsPaid ? 
      JSON.parse(data.fields.paidContent || '[]') :
      JSON.parse(data.fields.freeContent || '[]');

    // Find the specific app in the content array
    const appIndex = contentArray.findIndex((app: any) => app.appId === appId);
    if (appIndex === -1) {
      throw new Error(`App with ID ${appId} not found`);
    }

    // Find the content index within the app's content array
    const contentIndex = contentArray[appIndex].content.findIndex((content: any) => content.contentId === contentId);
    if (contentIndex === -1) {
      throw new Error(`Content with ID ${contentId} not found in app`);
    }

    // Create new content array without the deleted content
    const updatedContent = [
      ...contentArray[appIndex].content.slice(0, contentIndex),
      ...contentArray[appIndex].content.slice(contentIndex + 1)
    ];

    // Create the updated app with the new content array
    const updatedApp = {
      ...contentArray[appIndex],
      content: updatedContent
    };

    // Create the new content array with the updated app
    const updatedContentArray = [
      ...contentArray.slice(0, appIndex),
      updatedApp,
      ...contentArray.slice(appIndex + 1)
    ];

    // Prepare the update data
    const updateData = {
      fields: {
        ...(appIsPaid ? { paidContent: JSON.stringify(updatedContentArray) } : { freeContent: JSON.stringify(updatedContentArray) })
      }
    };

    // Update the creator record with the new content
    await updateCreatorRecord(recordId, updateData);

    return {
      success: true,
      message: 'Content deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
}