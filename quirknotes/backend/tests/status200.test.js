const axios = require('axios');
const baseUrl = 'http://localhost:4000';

// Helper function to create a note
async function createNote(title, content, color = null) {
  const response = await axios.post(`${baseUrl}/postNote`, { title, content, ...(color && { color }) });
  return response.data.insertedId;
}

// Helper function to delete all notes
async function deleteAllNotes() {
  await axios.delete(`${baseUrl}/deleteAllNotes`);
}

describe("Note API Tests", () => {
  beforeEach(async () => {
    // Ensure the database is in a known state before each test
    await deleteAllNotes();
  });

  test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
    const response = await axios.get(`${baseUrl}/getAllNotes`);
    expect(response.status).toBe(200);
    expect(response.data.response).toEqual([]);
  });

  test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
    // Setup: Create two notes
    await createNote("Test Title 1", "Test Content 1");
    await createNote("Test Title 2", "Test Content 2");

    const response = await axios.get(`${baseUrl}/getAllNotes`);
    expect(response.status).toBe(200);
    expect(response.data.response.length).toBe(2);
  });

  test("/deleteNote - Delete a note", async () => {
    // Setup: Create a note to delete
    const insertedId = await createNote("Delete Me", "Delete this note");

    const deleteResponse = await axios.delete(`${baseUrl}/deleteNote/${insertedId}`);
    expect(deleteResponse.status).toBe(200);

    // Verification: Ensure the note is deleted
    const getResponse = await axios.get(`${baseUrl}/getAllNotes`);
    expect(getResponse.data.response.find(note => note._id === insertedId)).toBeUndefined();
  });

  test("/patchNote - Patch with content and title", async () => {
    // Setup: Create a note to patch
    const insertedId = await createNote("Patch Title", "Patch Content");

    // Patch the note
    const patchResponse = await axios.patch(`${baseUrl}/patchNote/${insertedId}`, {
      title: "New Title",
      content: "New Content"
    });
    expect(patchResponse.status).toBe(200);

    // Verification: Fetch the note and verify changes
    const getResponse = await axios.get(`${baseUrl}/getAllNotes`);
    const updatedNote = getResponse.data.response.find(note => note._id === insertedId);
    expect(updatedNote.title).toBe("New Title");
    expect(updatedNote.content).toBe("New Content");
  });

  test("/patchNote - Patch with just title", async () => {
    // Setup: Create a note
    const insertedId = await createNote("Title Only Before", "Content Unchanged");

    // Patch the note's title only
    const patchResponse = await axios.patch(`${baseUrl}/patchNote/${insertedId}`, {
      title: "Title Only After"
    });
    expect(patchResponse.status).toBe(200);

    // Verification
    const getResponse = await axios.get(`${baseUrl}/getAllNotes`);
    const updatedNote = getResponse.data.response.find(note => note._id === insertedId);
    expect(updatedNote.title).toBe("Title Only After");
    // Content should remain unchanged
    expect(updatedNote.content).toBe("Content Unchanged");
  });

  test("/patchNote - Patch with just content", async () => {
    // Setup
    const insertedId = await createNote("Title Unchanged", "Content Only Before");

    // Patch the note's content only
    const patchResponse = await axios.patch(`${baseUrl}/patchNote/${insertedId}`, {
      content: "Content Only After"
    });
    expect(patchResponse.status).toBe(200);

    // Verification
    const getResponse = await axios.get(`${baseUrl}/getAllNotes`);
    const updatedNote = getResponse.data.response.find(note => note._id === insertedId);
    expect(updatedNote.content).toBe("Content Only After");
    // Title should remain unchanged
    expect(updatedNote.title).toBe("Title Unchanged");
  });

  test("/deleteAllNotes - Delete one note", async () => {
    // Setup: Ensure there's only one note to delete
    await createNote("Single Note", "This is the only note.");

    const deleteResponse = await axios.delete(`${baseUrl}/deleteAllNotes`);
    expect(deleteResponse.status).toBe(200);

    // Verification: Ensure no notes are left
    const getResponse = await axios.get(`${baseUrl}/getAllNotes`);
    expect(getResponse.data.response.length).toBe(0);
  });

  test("/deleteAllNotes - Delete three notes", async () => {
    // Setup: Create three notes
    await createNote("Note 1", "Content 1");
    await createNote("Note 2", "Content 2");
    await createNote("Note 3", "Content 3");

    const deleteResponse = await axios.delete(`${baseUrl}/deleteAllNotes`);
    expect(deleteResponse.status).toBe(200);

    // Verification: Ensure no notes are left
    const getResponse = await axios.get(`${baseUrl}/getAllNotes`);
    expect(getResponse.data.response.length).toBe(0);
  });

  test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
    // Setup: Create a note to update its color
    const insertedId = await createNote("Color Change", "This note will change color.");

    const updateResponse = await axios.patch(`${baseUrl}/updateNoteColor/${insertedId}`, {
      color: "#FF0000"
    });
    expect(updateResponse.status).toBe(200);

    // Verification: Fetch the note and verify the color change
    const getResponse = await axios.get(`${baseUrl}/getAllNotes`);
    const updatedNote = getResponse.data.response.find(note => note._id === insertedId);
    expect(updatedNote.color).toBe("#FF0000");
  });
});

  
  
  
  

  
  
  
  
  
    
