// This function assigns page-# to students, and filters them to show only page 1
const paginate = ($studentsToPaginate) => {
  $('.pagination').remove();                           // Remove existing pagination links
  $('.student-list li').not('.matched').removeClass()  // Reassign student classes to remove existing 'page-#' class
    .addClass('student-item cf');
  $($studentsToPaginate).removeClass()
    .addClass('student-item cf matched');
    // Check that the list has more than 0 entries
  if($studentsToPaginate.length > 0) {
    let howManyPages = Math.floor(($studentsToPaginate.length - 1) / 10) + 1;  // How many pages do we need?
    // Add Class of 'page-#' to each student
    const assignPagesToStudents = ($listOfStudents) => {
      $listOfStudents.each(function(index) {
        let page = Math.floor(index / 10) + 1; // Which page is this student on?
        $(this).addClass(`page-${page}`);      // Assign it as a class
      });
    };
    // Append Buttons
    const generateButtons = () => {
      let paginationDiv = document.createElement('div'); // Create Div to hold buttons
      paginationDiv.className = "pagination";            // Give it class 'pagination'
      let buttonList = document.createElement('ul');     // Create ul to hold buttons                                                         // Append Them to the page
      $(paginationDiv).append(buttonList);               // Append them to the page
      $('.page').append(paginationDiv);
        // Add the correct # of li's
      for(let i = 1; i <= howManyPages; i++) {
        let newButton = document.createElement('a');     // Create new link, and list item
        let newLi = document.createElement('li');
        $(newButton).text(i).attr('href', '#');          // Set link text to page #, and href to '#'
        $(newLi).append(newButton);                      // Append them
        $(buttonList).append(newLi);
      }
    };
    // Filter Students By Page
    const filter = (page) => {
      $('.student-item').attr('hidden', true);                  // Hide All Students
      $(`.page-${page}`).attr('hidden', false);                 // Show students with matching page class
      $('.pagination .active').removeClass('active');           // Remove 'active' class from old button,
      $(`.pagination a:contains(${page})`).addClass('active');  // Add 'active' class to new button
    };

    assignPagesToStudents($studentsToPaginate);                 // Call function to assign page classes to students
    if(howManyPages > 1) {                                      // Don't generate links unless there are multiple pages
      generateButtons();
    }
    filter(1);                                                  // Call function to hide all students except those on page 1

    //Listener for pageButton clicks
    $('.pagination').on('click', (event) => {
        let pageClicked = event.target.textContent;
        filter(pageClicked);
        $(event.target).addClass('active');
    });
  }
}

// Dynamically add Search input
const attachSearch = () => {
  let searchDiv = document.createElement('div');                 // Create elements
  let searchInput = document.createElement('input');
  let searchButton = document.createElement('button');
                                                                 // Define attributes
  $(searchDiv).addClass('student-search');
  $(searchInput).attr('placeholder', 'Search for students...');
  $(searchButton).text('Search');
                                                                 // Append them to the DOM
  $(searchDiv).append(searchInput);
  $(searchDiv).append(searchButton);
  $('.page-header').append(searchDiv);
};

// Search Function
const search = (searchTerm) => {
  let matches = 0;                                       // Keep track of Matches
  if (searchTerm !== '') {                               // If search isn't blank
    // Function to test search term against current entry
    const isMatch = (details, searchTerm) => {
      const search = new RegExp(searchTerm, 'gi');       // Using RegExp,
      return search.test(details);                       // Test if student details contain the search term
    };
    $('.student-item').attr('hidden', true);             // Hide all students
    $('.student-details').each(function() {              // For each student
      let details = this.textContent;                    // Get text details
      details = details.slice(0, details.indexOf('@'));  // Remove everything following the @ in their e-mail
      if(isMatch(details, searchTerm)) {                 // If anything matches
        $(this).parent().attr('hidden', false)           // Show the student
          .addClass('matched');                          // Add class of matched
        matches++;                                       // And increment matches counter
      } else {                                           // Otherwise, remove the class of matched, and hide the student
        $(this).parent().removeClass('matched')
          .attr('hidden', true);
      }
    });
  } else {                                               // Allow a blank search to return all results
    $('.student-item').attr('hidden', false)
      .addClass('matched');
    matches = '';
  }
  return matches;                                        // Return # of matches
};

attachSearch();                                          // Call function to attach search
paginate($('.student-item'));                            // Paginate all student items

// Event Listener for search button
$('.student-search').on('click keypress', (event) => {
  if (event.target.tagName === 'BUTTON' || event.keyCode === 13) {
    const searchTerm = $('.student-search input').val();                        // Get input value, and store in searchTerm
    $('.student-search input').val('');                                         // Reset input value
    $('.results').remove();                                                     // Remove the results banner
    let matches = search(searchTerm);                                           // Run the search function, and store the # of matches
    $(`<h3 class="results">${matches} Results Found for "${searchTerm}"</h3>`)  // Insert new results banner, "# Results Found for 'searchTerm'"
      .insertAfter('.page-header');
    paginate($('.matched'));                                                    // Paginate the matches
  }
});
