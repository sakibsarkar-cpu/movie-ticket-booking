/*
    ============================
    MOVIE DATA
    ============================
*/

export const movies = [
    {
        movieID: 1,
        title: "Inception",
        genre: "Sci-Fi",
        description:
            "A skilled extractor enters people's dreams to steal valuable secrets.",
        duration: "2h 28m",
        language: "English",
        releaseDate: "2010-07-16",
        image:
            "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
        rating: 8.8,
    },

    {
        movieID: 2,
        title: "Interstellar",
        genre: "Sci-Fi",
        description:
            "A group of explorers travel through a wormhole in search of a new home for humanity.",
        duration: "2h 49m",
        language: "English",
        releaseDate: "2014-11-07",
        image:
            "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        rating: 8.7,
    },

    {
        movieID: 3,
        title: "The Dark Knight",
        genre: "Action",
        description:
            "Batman faces a dangerous criminal who creates chaos across Gotham City.",
        duration: "2h 32m",
        language: "English",
        releaseDate: "2008-07-18",
        image:
            "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        rating: 9.0,
    },

    {
        movieID: 4,
        title: "Avengers: Endgame",
        genre: "Action",
        description:
            "The Avengers attempt to reverse the devastating events that changed the universe.",
        duration: "3h 1m",
        language: "English",
        releaseDate: "2019-04-26",
        image:
            "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        rating: 8.4,
    },

    {
        movieID: 5,
        title: "Parasite",
        genre: "Drama",
        description:
            "A struggling family becomes involved with a wealthy household in an unexpected way.",
        duration: "2h 12m",
        language: "Korean",
        releaseDate: "2019-05-30",
        image:
            "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        rating: 8.5,
    },

    {
        movieID: 6,
        title: "The Matrix",
        genre: "Sci-Fi",
        description:
            "A computer programmer discovers that reality is not what it appears to be.",
        duration: "2h 16m",
        language: "English",
        releaseDate: "1999-03-31",
        image:
            "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        rating: 8.7,
    },

    {
        movieID: 7,
        title: "Avatar",
        genre: "Sci-Fi",
        description:
            "A marine on an alien planet becomes torn between following his orders and protecting the world he has come to love.",
        duration: "2h 42m",
        language: "English",
        releaseDate: "2026-09-10",
        image:
            "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
        rating: 8.0,
    },
];


/*
    ============================
    CINEMA BRANCHES
    ============================
*/

export const branches = [
    {
        branchID: 1,
        branchName: "MovieBook Dhanmondi",
        location: "Dhanmondi, Dhaka",
    },

    {
        branchID: 2,
        branchName: "MovieBook Bashundhara",
        location: "Bashundhara, Dhaka",
    },

    {
        branchID: 3,
        branchName: "MovieBook Uttara",
        location: "Uttara, Dhaka",
    },
];


/*
    ============================
    SCREENS
    ============================

    screenID is the main identifier.

    Each screen belongs to a branch.
*/

export const screens = [
    {
        screenID: 1,
        screenName: "Screen 1",
        branchID: 1,
    },

    {
        screenID: 2,
        screenName: "Screen 2",
        branchID: 1,
    },

    {
        screenID: 3,
        screenName: "Screen 1",
        branchID: 2,
    },

    {
        screenID: 4,
        screenName: "Screen 3",
        branchID: 3,
    },
];


/*
    ============================
    SHOW SCHEDULES
    ============================

    Every schedule contains:

    scheduleID
    movieID
    branchID
    screenID
    showDate
    startTime
    endTime
    ticketPrice
    status

    Screen name should always be
    calculated from screenID.
*/

export const schedules = [

    /*
        ============================
        INCEPTION
        ============================
    */

    {
        scheduleID: 1,
        movieID: 1,
        branchID: 1,
        screenID: 1,
        showDate: "2026-09-01",
        startTime: "10:00",
        endTime: "12:28",
        ticketPrice: 350,
        status: "Active",
    },

    {
        scheduleID: 2,
        movieID: 1,
        branchID: 1,
        screenID: 2,
        showDate: "2026-09-01",
        startTime: "15:00",
        endTime: "17:28",
        ticketPrice: 400,
        status: "Active",
    },

    {
        scheduleID: 3,
        movieID: 1,
        branchID: 2,
        screenID: 3,
        showDate: "2026-09-01",
        startTime: "18:30",
        endTime: "20:58",
        ticketPrice: 450,
        status: "Active",
    },

    {
        scheduleID: 4,
        movieID: 1,
        branchID: 3,
        screenID: 4,
        showDate: "2026-09-02",
        startTime: "14:00",
        endTime: "16:28",
        ticketPrice: 350,
        status: "Active",
    },


    /*
        ============================
        INTERSTELLAR
        ============================
    */

    {
        scheduleID: 5,
        movieID: 2,
        branchID: 1,
        screenID: 1,
        showDate: "2026-09-01",
        startTime: "11:00",
        endTime: "13:49",
        ticketPrice: 350,
        status: "Active",
    },

    {
        scheduleID: 6,
        movieID: 2,
        branchID: 2,
        screenID: 3,
        showDate: "2026-09-01",
        startTime: "16:00",
        endTime: "18:49",
        ticketPrice: 450,
        status: "Active",
    },

    {
        scheduleID: 7,
        movieID: 2,
        branchID: 3,
        screenID: 4,
        showDate: "2026-09-02",
        startTime: "19:00",
        endTime: "21:49",
        ticketPrice: 400,
        status: "Active",
    },


    /*
        ============================
        THE DARK KNIGHT
        ============================
    */

    {
        scheduleID: 8,
        movieID: 3,
        branchID: 1,
        screenID: 2,
        showDate: "2026-09-01",
        startTime: "12:00",
        endTime: "14:32",
        ticketPrice: 350,
        status: "Active",
    },

    {
        scheduleID: 9,
        movieID: 3,
        branchID: 2,
        screenID: 3,
        showDate: "2026-09-01",
        startTime: "17:00",
        endTime: "19:32",
        ticketPrice: 450,
        status: "Active",
    },

    {
        scheduleID: 10,
        movieID: 3,
        branchID: 3,
        screenID: 4,
        showDate: "2026-09-02",
        startTime: "20:00",
        endTime: "22:32",
        ticketPrice: 400,
        status: "Active",
    },


    /*
        ============================
        AVENGERS: ENDGAME
        ============================
    */

    {
        scheduleID: 11,
        movieID: 4,
        branchID: 1,
        screenID: 1,
        showDate: "2026-09-01",
        startTime: "10:30",
        endTime: "13:21",
        ticketPrice: 400,
        status: "Active",
    },

    {
        scheduleID: 12,
        movieID: 4,
        branchID: 2,
        screenID: 3,
        showDate: "2026-09-01",
        startTime: "15:30",
        endTime: "18:21",
        ticketPrice: 450,
        status: "Active",
    },

    {
        scheduleID: 13,
        movieID: 4,
        branchID: 3,
        screenID: 4,
        showDate: "2026-09-02",
        startTime: "19:30",
        endTime: "22:21",
        ticketPrice: 400,
        status: "Active",
    },


    /*
        ============================
        PARASITE
        ============================
    */

    {
        scheduleID: 14,
        movieID: 5,
        branchID: 1,
        screenID: 2,
        showDate: "2026-09-01",
        startTime: "11:30",
        endTime: "13:42",
        ticketPrice: 300,
        status: "Active",
    },

    {
        scheduleID: 15,
        movieID: 5,
        branchID: 2,
        screenID: 3,
        showDate: "2026-09-01",
        startTime: "16:30",
        endTime: "18:42",
        ticketPrice: 400,
        status: "Active",
    },

    {
        scheduleID: 16,
        movieID: 5,
        branchID: 3,
        screenID: 4,
        showDate: "2026-09-02",
        startTime: "20:30",
        endTime: "22:42",
        ticketPrice: 350,
        status: "Active",
    },


    /*
        ============================
        THE MATRIX
        ============================
    */

    {
        scheduleID: 17,
        movieID: 6,
        branchID: 1,
        screenID: 2,
        showDate: "2026-09-01",
        startTime: "12:30",
        endTime: "14:46",
        ticketPrice: 350,
        status: "Active",
    },

    {
        scheduleID: 18,
        movieID: 6,
        branchID: 2,
        screenID: 3,
        showDate: "2026-09-01",
        startTime: "17:30",
        endTime: "19:46",
        ticketPrice: 450,
        status: "Active",
    },

    {
        scheduleID: 19,
        movieID: 6,
        branchID: 3,
        screenID: 4,
        showDate: "2026-09-02",
        startTime: "21:00",
        endTime: "23:16",
        ticketPrice: 400,
        status: "Active",
    },


    /*
        ============================
        AVATAR
        ============================
    */

    {
        scheduleID: 20,
        movieID: 7,
        branchID: 3,
        screenID: 4,
        showDate: "2026-09-10",
        startTime: "18:00",
        endTime: "20:42",
        ticketPrice: 450,
        status: "Active",
    },
];