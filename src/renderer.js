async function findDocuments({ query = {}, sort = {}, limit, offset } = {}) {
  try {
    console.log('Hellosfd');
    const docs = await window.electron.getClipboard({ query, sort, limit, offset })
    console.log('fsdsd', docs)
    return docs;
  } catch (error) {
    console.error('Error fetching documents:', error);
  }
}

// Example: Get first 5 users sorted by age ascending
// findDocuments({ 
//   query: {}, 
//   sort: { date: -1 }, // 1 is asc and -1 is desc
//   limit: 5, 
//   offset: 0 
// });

// // Example: Get next 5 users (for pagination)
// findDocuments({ 
//   query: {}, 
//   sort: { date: -1 }, 
//   limit: 5, 
//   offset: 5 
// });

document.getElementById('fetchDataButton').addEventListener('click', () => {
    let inputNumber = parseInt(document.getElementById('clipboardNumber').value, 10);
    findDocuments({
      query: {},          // Fetch all
      sort: { date: -1 },    // Sort by age ascending
      limit: 1,
      offset: inputNumber
    });
  });