/* ==========================================================================
   AUSTIN SPURS — SITE DATA
   --------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT WEEK TO WEEK.

   To change whether Mister Tramps is open for a match, find the fixture below
   and change its "tramps" value:

        "open"    -> green light  (we're on, Tramps is showing it)
        "closed"  -> red light    (Tramps is not showing this one)
        "tbd"     -> amber light  (not decided yet)

   You can also add a short "note" to any fixture. It shows under the match.
   Save the file, refresh the site. That's it. Nothing else to touch.
   ========================================================================== */

window.AUSTIN_SPURS = {

  /* ---------------------------------------------------------------
     1. SETTINGS
     --------------------------------------------------------------- */
  settings: {
    email: "austinspurs@gmail.com",

    /* Signing up runs through Tottenham, because Austin Spurs is an official
       supporters club and the club keeps the member roster. This URL is the
       one thing that has to be right for the join page to work. */
    officialClubUrl: "https://www.tottenhamhotspur.com/supporters-clubs/872970/austin-spurs",

    /* Superseded by officialClubUrl. Left in place because if Spurs ever change
       how membership works, a Google Form is the fallback: paste an embed URL
       here and the join page switches back to showing a form. */
    googleFormEmbedUrl: "",
    googleFormShareUrl: "",

    venue: {
      name: "Mister Tramps Sports Pub & Cafe",
      street: "8565 Research Blvd",
      city: "Austin, TX 78758",
      phone: "(512) 837-3500",
      website: "https://mistertramps.org/"
    },

    /* Social accounts. Put your real handles/URLs in here — the homepage reads
       from this. Set a url to "" to grey that one out as "coming soon", which
       is how TikTok is showing right now. */
    /* CAUTION: "Austin Spurs" is also the San Antonio Spurs' G League affiliate.
       On Instagram and X we hold @austinspurs and they use @austin_spurs — but
       on Facebook it's the other way round: facebook.com/austinspurs is theirs,
       and ours is the group URL below. Check any new handle before adding it.
       An empty string greys the tile out as "coming soon". */
    social: {
      instagram: "https://instagram.com/austinspurs",
      facebook:  "https://www.facebook.com/groups/austinspurs/",
      x:         "https://x.com/austinspurs",
      bluesky:   "https://bsky.app/profile/austinspurs.bsky.social",
      tiktok:    ""
    },

    /* Shown on the events page above the fixture list */
    seasonLabel: "2026/27 Premier League",

    /* Set to a date string to freeze "today" for testing, otherwise leave null */
    todayOverride: null
  },

  /* ---------------------------------------------------------------
     2. FEATURED EVENT  (the big banner on the Events page)
         Set "active": false to hide the banner after it passes.
     --------------------------------------------------------------- */
  featuredEvent: {
    active: true,
    tag: "Opening Weekend",
    title: "Premier League Coast to Coast Kick Off",
    date: "2026-08-22",
    dateLabel: "Saturday, August 22, 2026",
    blurb: "The Premier League picked one venue per club across the United States for opening weekend. Tottenham Hotspur's is right here in Austin, at Mister Tramps.",
    /* Label follows the link. It said "Event details" when this pointed at
       coast-to-coast.html; pointing that wording at a registration form would
       be a bait and switch. */
    ctaLabel: "Register",
    ctaHref: "https://flowsto.com/COnx51sJX"
  },

  /* ---------------------------------------------------------------
     3. FIXTURES  — Tottenham Hotspur Men's First Team, 2026/27
         Source: tottenhamhotspur.com official fixture list (provisional).
         Times shown are Central Time, converted from UK kickoff.
         "comp": Premier League | Carabao Cup | FA Cup
         "tramps": open | closed | tbd
     --------------------------------------------------------------- */
  fixtures: [
    { date: "2026-08-22", opponent: "Brentford",            venue: "A", comp: "Premier League", uk: "5.30pm", ct: "11:30 AM", tramps: "open",
      note: "Premier League Coast to Coast Kick Off — the big one. Doors early, full house expected.", featured: true },
    /* We enter the Carabao Cup at Round Two — no European football this season.
       Draw is 10 Aug, tie falls in the week of 24 Aug. Date below is a
       placeholder so the week isn't blank; replace it with the real date and
       opponent once the draw is made. */
    { date: "2026-08-26", opponent: "Carabao Cup Round Two", venue: "?", comp: "Carabao Cup", uk: "TBC", ct: "TBC", tramps: "tbd",
      note: "Opponent and date confirmed after the 10 August draw. Expect it midweek, week of 24 August." },
    { date: "2026-08-29", opponent: "Newcastle United",     venue: "H", comp: "Premier League", uk: "5.30pm",    ct: "11:30 AM",  tramps: "open" },

    { date: "2026-09-05", opponent: "Nottingham Forest",    venue: "A", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "open" },
    { date: "2026-09-12", opponent: "Everton",              venue: "H", comp: "Premier League", uk: "5.30pm",    ct: "11:30 AM",  tramps: "tbd" },
    { date: "2026-09-19", opponent: "Aston Villa",          venue: "H", comp: "Premier League", uk: "12.30pm",    ct: "6:30 AM",  tramps: "tbd",
      note: "Early one — 6:30am in Austin. Tramps opening time to be confirmed." },
    /* Only happens if we win the Round Two tie. Placeholder date. */
    { date: "2026-09-23", opponent: "Carabao Cup Round Three", venue: "?", comp: "Carabao Cup", uk: "TBC", ct: "TBC", tramps: "tbd",
      note: "Only if we get through Round Two. Date and opponent to be confirmed." },

    { date: "2026-10-10", opponent: "Manchester United",    venue: "A", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },
    { date: "2026-10-17", opponent: "Coventry City",        venue: "H", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },
    { date: "2026-10-24", opponent: "Chelsea",              venue: "A", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },
    { date: "2026-10-28", opponent: "Carabao Cup Round Four", venue: "?", comp: "Carabao Cup", uk: "TBC", ct: "TBC", tramps: "tbd" },
    { date: "2026-10-31", opponent: "Crystal Palace",       venue: "H", comp: "Premier League", uk: "3pm",    ct: "10:00 AM", tramps: "tbd",
      note: "UK clocks change this weekend — kickoff shifts an hour later in Austin." },

    { date: "2026-11-07", opponent: "Leeds United",         venue: "A", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },
    { date: "2026-11-21", opponent: "Ipswich Town",         venue: "H", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },
    { date: "2026-11-28", opponent: "Sunderland",           venue: "A", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd",
      note: "May move to Sunday or Monday for opponents' Europa League commitments." },

    { date: "2026-12-02", opponent: "Fulham",               venue: "H", comp: "Premier League", uk: "8pm",    ct: "2:00 PM",  tramps: "tbd" },
    { date: "2026-12-05", opponent: "Arsenal",              venue: "H", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd",
      note: "North London derby." },
    { date: "2026-12-12", opponent: "Hull City",            venue: "A", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },
    { date: "2026-12-16", opponent: "Carabao Cup Round Five", venue: "?", comp: "Carabao Cup", uk: "TBC", ct: "TBC", tramps: "tbd" },
    { date: "2026-12-19", opponent: "Liverpool",            venue: "A", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },
    { date: "2026-12-26", opponent: "AFC Bournemouth",      venue: "H", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd",
      note: "Boxing Day." },
    { date: "2026-12-30", opponent: "Brighton & Hove Albion", venue: "H", comp: "Premier League", uk: "8pm",  ct: "2:00 PM",  tramps: "tbd" },

    { date: "2027-01-02", opponent: "Manchester City",      venue: "A", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },
    { date: "2027-01-06", opponent: "Fulham",               venue: "A", comp: "Premier League", uk: "8pm",    ct: "2:00 PM",  tramps: "tbd" },
    { date: "2027-01-09", opponent: "FA Cup Round Three",   venue: "?", comp: "FA Cup", uk: "TBC", ct: "TBC", tramps: "tbd" },
    { date: "2027-01-13", opponent: "Carabao Cup Semi-Final, First Leg", venue: "?", comp: "Carabao Cup", uk: "TBC", ct: "TBC", tramps: "tbd" },
    { date: "2027-01-16", opponent: "Leeds United",         venue: "H", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },
    { date: "2027-01-23", opponent: "Crystal Palace",       venue: "A", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd",
      note: "May move to Sunday or Monday for opponents' Europa League commitments." },
    { date: "2027-01-30", opponent: "Sunderland",           venue: "H", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd",
      note: "May move to Sunday or Monday for opponents' Europa League commitments." },

    { date: "2027-02-03", opponent: "Carabao Cup Semi-Final, Second Leg", venue: "?", comp: "Carabao Cup", uk: "TBC", ct: "TBC", tramps: "tbd" },
    { date: "2027-02-06", opponent: "Ipswich Town",         venue: "A", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },
    { date: "2027-02-10", opponent: "Manchester City",      venue: "H", comp: "Premier League", uk: "8pm",    ct: "2:00 PM",  tramps: "tbd" },
    { date: "2027-02-13", opponent: "FA Cup Round Four",    venue: "?", comp: "FA Cup", uk: "TBC", ct: "TBC", tramps: "tbd" },
    { date: "2027-02-20", opponent: "Brighton & Hove Albion", venue: "A", comp: "Premier League", uk: "3pm",  ct: "9:00 AM",  tramps: "tbd" },
    { date: "2027-02-27", opponent: "Liverpool",            venue: "H", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },

    { date: "2027-03-03", opponent: "AFC Bournemouth",      venue: "A", comp: "Premier League", uk: "8pm",    ct: "2:00 PM",  tramps: "tbd" },
    { date: "2027-03-06", opponent: "FA Cup Round Five",    venue: "?", comp: "FA Cup", uk: "TBC", ct: "TBC", tramps: "tbd" },
    { date: "2027-03-13", opponent: "Nottingham Forest",    venue: "H", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },
    { date: "2027-03-20", opponent: "Everton",              venue: "A", comp: "Premier League", uk: "3pm",    ct: "10:00 AM", tramps: "tbd",
      note: "US clocks changed a week early — kickoff is an hour later than usual." },
    { date: "2027-03-21", opponent: "Carabao Cup Final",    venue: "?", comp: "Carabao Cup", uk: "TBC", ct: "TBC", tramps: "tbd" },

    { date: "2027-04-03", opponent: "FA Cup Round Six",     venue: "?", comp: "FA Cup", uk: "TBC", ct: "TBC", tramps: "tbd" },
    { date: "2027-04-10", opponent: "Brentford",            venue: "H", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },
    { date: "2027-04-17", opponent: "Newcastle United",     venue: "A", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },
    { date: "2027-04-24", opponent: "Hull City",            venue: "H", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd",
      note: "Clashes with the FA Cup semi-final weekend — date subject to change." },

    { date: "2027-05-01", opponent: "Arsenal",              venue: "A", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd",
      note: "North London derby." },
    { date: "2027-05-08", opponent: "Chelsea",              venue: "H", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },
    { date: "2027-05-15", opponent: "Coventry City",        venue: "A", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },
    { date: "2027-05-22", opponent: "FA Cup Final",         venue: "?", comp: "FA Cup", uk: "TBC", ct: "TBC", tramps: "tbd" },
    { date: "2027-05-23", opponent: "Manchester United",    venue: "H", comp: "Premier League", uk: "3pm",    ct: "9:00 AM",  tramps: "tbd" },
    { date: "2027-05-30", opponent: "Aston Villa",          venue: "A", comp: "Premier League", uk: "4pm",    ct: "10:00 AM", tramps: "tbd",
      note: "Final day." }
  ]
};
