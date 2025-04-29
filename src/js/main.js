
// Helper function to generate a unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Get data from localStorage
function getContentData(type) {
  const storedData = localStorage.getItem(type);
  return storedData ? JSON.parse(storedData) : [];
}

// Save data to localStorage
function saveContentData(type, data) {
  localStorage.setItem(type, JSON.stringify(data));
}

// Format date to be more readable
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Get created timestamp of an existing item
function getCreatedAt(type, id) {
  const items = getContentData(type);
  const item = items.find(item => item.id === id);
  return item ? item.createdAt : new Date().toISOString();
}

// Save content (create or update)
function saveContent(item) {
  const items = getContentData(item.type);
  const existingItemIndex = items.findIndex(i => i.id === item.id);
  
  if (existingItemIndex !== -1) {
    // Update existing item
    items[existingItemIndex] = item;
  } else {
    // Add new item
    items.push(item);
  }
  
  saveContentData(item.type, items);
}

// Delete content
function deleteContent(type, id) {
  const items = getContentData(type);
  const updatedItems = items.filter(item => item.id !== id);
  saveContentData(type, updatedItems);
}

// Display content in the relevant container
function displayContent(type) {
  const items = getContentData(type);
  const container = $(`#${type}`);
  
  if (items.length === 0) {
    container.html('<div class="card">No items found. Create your first one!</div>');
    return;
  }
  
  // Sort items by creation date (newest first)
  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  let html = '<div class="grid">';
  
  items.forEach(item => {
    html += createItemCard(item);
  });
  
  html += '</div>';
  container.html(html);
  
  // Add event listeners for edit and delete buttons
  $('.edit-btn').on('click', function() {
    const id = $(this).data('id');
    const type = $(this).data('type');
    window.location.href = `create-${type}.html?id=${id}`;
  });
  
  $('.delete-btn').on('click', function() {
    if (confirm('Are you sure you want to delete this item?')) {
      const id = $(this).data('id');
      const type = $(this).data('type');
      deleteContent(type, id);
      displayContent(type);
    }
  });
}

// Create HTML for an item card
function createItemCard(item) {
  let html = `
    <div class="item-card">
      <div class="item-card-header">
        <h3 class="item-title">${item.title}</h3>
        <span class="badge badge-${item.type === 'events' ? 'event' : item.type === 'news' ? 'news' : 'blog'}">${item.type}</span>
      </div>
  `;
  
  if (item.type === 'events') {
    html += `
      <p class="item-subtitle">Date: ${formatDate(item.date)} at ${item.location}</p>
      <div class="item-content">${item.description.substring(0, 100)}${item.description.length > 100 ? '...' : ''}</div>
    `;
  } else if (item.type === 'news') {
    html += `
      <p class="item-subtitle">By ${item.author} on ${formatDate(item.createdAt)}</p>
      <div class="item-content">${item.content.substring(0, 100)}${item.content.length > 100 ? '...' : ''}</div>
    `;
  } else if (item.type === 'blog') {
    html += `
      <p class="item-subtitle">By ${item.author} in ${item.category} on ${formatDate(item.createdAt)}</p>
      <div class="item-content">${item.content.substring(0, 100)}${item.content.length > 100 ? '...' : ''}</div>
    `;
  }
  
  html += `
    <div class="item-actions">
      <button class="btn btn-secondary edit-btn" data-id="${item.id}" data-type="${item.type}">Edit</button>
      <button class="btn btn-danger delete-btn" data-id="${item.id}" data-type="${item.type}">Delete</button>
    </div>
  </div>
  `;
  
  return html;
}

// Load item data for editing
function loadItemForEditing(type, id) {
  const items = getContentData(type);
  const item = items.find(item => item.id === id);
  
  if (!item) {
    alert('Item not found');
    window.location.href = `${type}.html`;
    return;
  }
  
  // Set form values based on item type
  $(`#${type}Id`).val(item.id);
  $('#title').val(item.title);
  
  if (type === 'events') {
    $('#date').val(item.date);
    $('#location').val(item.location);
    $('#description').val(item.description);
  } else if (type === 'news') {
    $('#author').val(item.author);
    $('#content').val(item.content);
  } else if (type === 'blog') {
    $('#author').val(item.author);
    $('#category').val(item.category);
    $('#content').val(item.content);
  }
}

// Filter content based on search term
function filterContent(type, searchTerm) {
  if (!searchTerm) {
    displayContent(type);
    return;
  }
  
  const items = getContentData(type);
  const container = $(`#${type}`);
  
  const filteredItems = items.filter(item => {
    const title = item.title.toLowerCase();
    
    // Search in different fields based on content type
    if (type === 'events') {
      const location = item.location.toLowerCase();
      const description = item.description.toLowerCase();
      return title.includes(searchTerm) || location.includes(searchTerm) || description.includes(searchTerm);
    } else if (type === 'news') {
      const author = item.author.toLowerCase();
      const content = item.content.toLowerCase();
      return title.includes(searchTerm) || author.includes(searchTerm) || content.includes(searchTerm);
    } else if (type === 'blog') {
      const author = item.author.toLowerCase();
      const category = item.category.toLowerCase();
      const content = item.content.toLowerCase();
      return title.includes(searchTerm) || author.includes(searchTerm) || category.includes(searchTerm) || content.includes(searchTerm);
    }
    
    return false;
  });
  
  if (filteredItems.length === 0) {
    container.html('<div class="card">No matching items found.</div>');
    return;
  }
  
  let html = '<div class="grid">';
  
  filteredItems.forEach(item => {
    html += createItemCard(item);
  });
  
  html += '</div>';
  container.html(html);
  
  // Add event listeners for edit and delete buttons
  $('.edit-btn').on('click', function() {
    const id = $(this).data('id');
    const type = $(this).data('type');
    window.location.href = `create-${type}.html?id=${id}`;
  });
  
  $('.delete-btn').on('click', function() {
    if (confirm('Are you sure you want to delete this item?')) {
      const id = $(this).data('id');
      const type = $(this).data('type');
      deleteContent(type, id);
      displayContent(type);
    }
  });
}

// Display recent content on the dashboard
function displayRecentContent() {
  const events = getContentData('events');
  const news = getContentData('news');
  const blog = getContentData('blog');
  
  // Combine all content
  const allContent = [...events, ...news, ...blog];
  
  // Sort by creation date (newest first)
  allContent.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Take the 6 most recent items
  const recentContent = allContent.slice(0, 6);
  
  const container = $('#recentContent');
  
  if (recentContent.length === 0) {
    container.html('<div class="card">No content found. Create your first content item!</div>');
    return;
  }
  
  let html = '<div class="grid">';
  
  recentContent.forEach(item => {
    html += createItemCard(item);
  });
  
  html += '</div>';
  container.html(html);
  
  // Add event listeners for edit and delete buttons
  $('.edit-btn').on('click', function() {
    const id = $(this).data('id');
    const type = $(this).data('type');
    window.location.href = `create-${type}.html?id=${id}`;
  });
  
  $('.delete-btn').on('click', function() {
    if (confirm('Are you sure you want to delete this item?')) {
      const id = $(this).data('id');
      const type = $(this).data('type');
      deleteContent(type, id);
      displayRecentContent();
    }
  });
}
