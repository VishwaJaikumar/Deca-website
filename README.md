# Tom Glenn DECA Chapter Dashboard

A web dashboard I built to help run our DECA chapter. Officers use it to keep track of members, competition and activity points, meeting attendance, and volunteer/service minutes in one place instead of scattered spreadsheets.

<!-- Live demo: add your Firebase Hosting link here, e.g. https://your-project.web.app -->

## Features

- **Members:** add, view, and manage chapter members.
- **Points:** award points to members, view a points summary, and browse a full points history.
- **Attendance:** a meeting check-in page for taking attendance and an attendance log to review past meetings.
- **Minutes tracker:** log time members put in and view the log, with a reports page for totals.
- **Home dashboard:** at-a-glance stats (members, points, active members) plus meetings and announcements.
- **Admin tools:** member management and point adjustments sit behind an admin login in the sidebar.

## Tech stack

- HTML, CSS, and vanilla JavaScript (no framework or build step)
- Firebase Firestore for the database
- Firebase Hosting for deployment
- Font Awesome for icons

## Project structure

```
index.html              Home dashboard
view-members.html       Member list
add-member.html         Add a member (admin)
manage-members.html     Edit and remove members (admin)
point-tracker.html      Points summary
points-history.html     Points history
admin-points.html       Adjust points (admin)
attendance-checkin.html Take meeting attendance
attendance-records.html Attendance log
minutes-track.html      Log service time
minutes-view.html       View the time log
minutes-reports.html    Time reports
shared-sidebar.js       Sidebar navigation and admin login, shared by every page
firebase-db.js          Firestore helper (members, points, attendance, minutes)
styles.css              Shared styles
```

## Run it locally

No install needed. Because the pages use ES modules, serve the folder over HTTP instead of opening the files directly:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Use your own Firebase project

This repo points at the chapter's Firebase project. To run your own copy:

1. Create a project in the [Firebase console](https://console.firebase.google.com/) and enable Firestore.
2. Replace the `firebaseConfig` object at the top of `firebase-db.js` with your project's web app config.
3. Set your own value for `password` in `shared-sidebar.js`.
4. Lock down your Firestore security rules before putting real member data in the database.

## Known limitations

- The admin login is a client-side check in `shared-sidebar.js`. It keeps casual users out of the admin pages but is not real security. Moving to Firebase Authentication with Firestore security rules is the next step.
- The home page meetings and announcements are static sample content, not loaded from the database.

## Credits

Built by Vishwa Jaikumar for the Tom Glenn DECA chapter. The school crest and DECA branding belong to their respective owners and are included for this chapter's use only.
