function autoDelete() {
  deleteCategory("Updates", 5);
}

function deleteCategory(category, deleteOlderThan) {
  var age = new Date();
  age.setDate(age.getDate() - deleteOlderThan);

  var beforeFilter = Utilities.formatDate(age, "America/Denver", "yyyy/MM/dd");
  var searchString = 'category:' + category + ' before:' + beforeFilter;

  var threads = collectWhileMore(searchString);
  console.log('Found %d threads using search string %s', threads.length, searchString);

  var count = 0;
  threads.forEach(t => {
    if (t.getLastMessageDate() < age) {
      t.moveToTrash();
      count++;
    }
  })
  console.log('Deleted %d messages', count);
}

function collectWhileMore(searchString) {
  var max = 100;
  var offset = 0;
  var allThreads = [];

  while (true) {
    var threads = GmailApp.search(searchString, offset, max);
    allThreads.push(threads);
    if (threads.length < max) {
      break;
    }
    offset += max;
  }
  return flatten(allThreads);
}

function flatten(array) {
  return array.reduce((a, b) => {
    return a.concat(b);
  })
}
