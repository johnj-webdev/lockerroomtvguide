async function fetchYouTubeData() {
  const channelIds = [
    "UC59b5GwfJN9HY7uhhCW-ACw", // SevanPodcast
    "UCctBkwMuD3dXd6JZM7kF1yQ", // CPW
    "UCDWA2wsU25M-6SZ13p7fBRQ", // GWTP
    "UCaEpcyYup1c_7dk68mzCzUQ", // BarbellSpin
    "UCeKKrZ5GnBXRwnKlrixiREQ", // Andrew Hiller
    "UCRs1pHnES3QDdh43xbjOmzw", // CF Games
    "UC2sH9LLMU4EFlmwMEConBJg", // JumpShip
    "UC0EZLTBYPDruKVKC5MHPGew", // Sentinel
    "UCZWGthaVvgLMrxELTxiccAA", // GlintonThings
    "UCu68dd1pSb5DV_5jzlobp1g", // Jason CF
    "UCgPJd9c32zXcphlTEmyS3HA", // BFriendly
    "UCNRMF4aKRFUCdzvJVBEMFdQ", // WODprep
    "UC7_bb_2e9Qq2NVCrgADCE6A", // Clydesdale
  ];

  const allResults = [];

  for (const channelId of channelIds) {
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet,id&channelId=${channelId}&maxResults=50&type=video&eventType=upcoming&key=AIzaSyApcnG5I9UW-suCvn7iYa3Bakp7NV6vghw`
    );
    const searchData = await searchResponse.json();

    for (const item of searchData.items) {
      const videoResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails,snippet&id=${item.id.videoId}&key=AIzaSyApcnG5I9UW-suCvn7iYa3Bakp7NV6vghw`
      );
      const videoData = await videoResponse.json();

      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=AIzaSyApcnG5I9UW-suCvn7iYa3Bakp7NV6vghw`
      );
      const channelData = await channelResponse.json();

      const scheduledStartTime = videoData.items[0].liveStreamingDetails
        ? new Date(videoData.items[0].liveStreamingDetails.scheduledStartTime)
        : null;
      const dayOfWeek = scheduledStartTime
        ? scheduledStartTime.toLocaleDateString("en-GB", { weekday: "long" })
        : "N/A";

      const datePDT = scheduledStartTime
        ? scheduledStartTime
            .toLocaleString("en-US", {
              timeZone: "America/Los_Angeles",
              hour12: true,
            })
            .replace(", ", "<br>")
        : "N/A";
      const dateCDT = scheduledStartTime
        ? scheduledStartTime
            .toLocaleString("en-US", {
              timeZone: "America/Chicago",
              hour12: true,
            })
            .replace(", ", "<br>")
        : "N/A";
      const dateEDT = scheduledStartTime
        ? scheduledStartTime
            .toLocaleString("en-US", {
              timeZone: "America/New_York",
              hour12: true,
            })
            .replace(", ", "<br>")
        : "N/A";
      const dateGMT = scheduledStartTime
        ? scheduledStartTime
            .toLocaleString("en-GB", {
              timeZone: "Europe/London",
              hour12: true,
            })
            .replace(", ", "<br>")
        : "N/A";

      const result = [
        `<a href="https://www.youtube.com/channel/${channelId}" target="_blank"><img src="${channelData.items[0].snippet.thumbnails.default.url}" alt="Channel Thumbnail" style="border-radius: 10px;"></a>`,
        item.snippet.channelTitle,
        item.snippet.title,
        `<a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank"><img src="${videoData.items[0].snippet.thumbnails.default.url}" alt="Video Thumbnail" style="border-radius: 10px;"></a>`,
        dayOfWeek,
        datePDT,
        dateCDT,
        dateEDT,
        dateGMT,
      ];

      allResults.push(result);
    }
  }

  allResults.sort(
    (a, b) =>
      new Date(a[5].replace("<br>", " ")) - new Date(b[5].replace("<br>", " "))
  ); // Assuming dateGMT is at index 5

  const tableBody = document
    .getElementById("live-table")
    .getElementsByTagName("tbody")[0];
  if (!tableBody) {
    console.error("Table body not found");
    return;
  }

  const tableHeaders = document.querySelectorAll("#live-table thead th");

  allResults.forEach((result) => {
    const row = tableBody.insertRow();
    result.forEach((cell, index) => {
      const cellElement = row.insertCell();
      cellElement.innerHTML = cell;
      if (tableHeaders[index]) {
        cellElement.setAttribute('data-label', tableHeaders[index].textContent);
      }
    });
  });
}

fetchYouTubeData();
