// Fetch the show data from the text file
fetch('data/shows.txt')
  .then(response => response.text())
  .then(data => {
    const currentDate = new Date();

    // Split the data into individual show entries
    const shows = data.split('\n').filter(show => show.trim() !== ''); // Exclude empty lines

    // Create an object to store shows by year
    const showsByYear = {};

    // Loop through each show entry and group them by year
    shows.forEach(show => {
      const [date, city, state, venue, startTime, endTime, notes] = show.split(',');
      const showYear = new Date(date).getFullYear();

      // Create a show object with the necessary details
      const showObj = {
        date,
        city,
        state,
        venue,
        startTime,
        endTime,
        notes
      };

      // Add the show object to the corresponding year
      if (!showsByYear[showYear]) {
        showsByYear[showYear] = [];
      }
      showsByYear[showYear].push(showObj);
    });

    // Get the container element
    const container = document.querySelector('.container');

    // Get the array of years and reverse their order
    const years = Object.keys(showsByYear).sort((a, b) => b - a);

    // Loop through each year and create a list for shows
    years.forEach(year => {
      // Create a heading for the year
      const yearHeading = document.createElement('h1');
      yearHeading.textContent = `${year} Show Dates`;

      // Check if the year is in the past
      if (year < currentDate.getFullYear()) {
        yearHeading.classList.add('past-year'); // Apply the 'past-year' class for styling
      }	

      // Create a list for the shows
      const showList = document.createElement('ul');

      // Loop through the shows of the current year
      showsByYear[year].forEach(show => {
        // Create a list item element
        const listItem = document.createElement('li');

        // Create a paragraph element to hold the show details
        const showDetails = document.createElement('p');

        // Check if the show date is in the past
        const showDate = new Date(show.date + "T24:00:00");
        if (showDate <= currentDate) {
          showDetails.classList.add('past-show'); // Apply the 'past-show' class for styling
        }

        // Construct the show details string
        let showDetailsText = `${show.date}<br>
                              ${show.city}, ${show.state}<br>
                              <span class="venue">${show.venue}</span>`;

        // Append the notes, if available
        if (show.notes && show.notes.trim() !== '') {
          showDetailsText += `<br><span class="notes">${show.notes}</span>`;
        }

        showDetailsText += `<br>${show.startTime} - ${show.endTime}`;
        showDetails.innerHTML = showDetailsText;

        // Append the show details to the list item
        listItem.appendChild(showDetails);

        // Append the list item to the show list
        showList.appendChild(listItem);
      });

      // Append the year heading and show list to the container
      container.appendChild(yearHeading);
      container.appendChild(showList);
    });
  })
  .catch(error => {
    console.error('Error loading show data:', error);
  });
