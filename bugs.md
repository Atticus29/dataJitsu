# Known issues

## Highly Urgent
<!-- - [ ] Collection creation sometimes doubles up on creation (find circumstances and fix) -->
<!-- - [ ] Adding collection on first stepper makes that stepper appear when you click "next" -->

### Minorly Urgent

<!-- - [ ] Feedback button -->
  <!-- - [ ] Submitting specific feedback in Safari sometimes freezes upon submission -->
  <!-- - [ ] Submitting general feedback pulls up a screenshot that has the top half of the screenshot in grey -->
  <!-- - [ ] Dismissing the specific dialog box before clicking submit works in some instances but not others -->
<!-- - [ ] DynamicFormQuestionComponent.html:5 ERROR Error: Cannot find control with name: 'collectionName' whenever I submit a collection. Mostly doesn't seem to mess anything up, but I don't understand what's causing the error or how to fix it -->
  <!-- - [ ] Oh I think the problem only exists when the collections node in the database is empty -->

### To Be Classified

<!-- - [ ] Custom move (choke) is sometimes being added to the candidate list and sometimes not; not clear yet why
  - [ ] Reproducible in cypress test; can't reproduce the effect manually -->
<!-- - [ ] Matches being added to the db are incomplete (I erased from videoannotatortest db). Look into this after you resolve table issues. -->
  <!-- - [ ] There is no id (when... not when I make from scratch, even when I disapprove all custom things) -->
- [ ] Confirm password required warning in create account for name and email as well
- [ ] Gender and gi rank overlap in create account; others are missing inputs
<!-- - [ ] Clicking annotate a video from another video doesn't do anything -->
- [ ] Video rating click doesn't fill the stars
- [ ] Feedback button is janky (in collections branch)
- [ ] I have to click on dropdown for "add another question for your users" button to "work"
  - [ ] Adding a new collection owner question doesn't repopulate the dropdown selections
- [ ] Deleting a collection seems to display "collection added" snackbar
- [ ] sometimes a collection that's not a COMPLETE representation of the collection gets added to the database.
- [ ] The snackbars for when a collection already exists fire off too many times (forever?). Probably especially noticeable when there are several collections in the database

### Minorly Urgent
- [ ] Upon load of video page, clicking on first annotation time simply starts the video, and it's not until the second click that it jumps to the time point
- [ ] Upon ending an annotation, video sometimes pauses, sometimes starts, and sometimes starts when a previous annotation begins(?) or ends(?)
- [ ] Video is full screen
- [ ] Sometime call to addGenericCandidateNameToDb creates something and then it is immediately deleted from db
- [ ] Sometimes sort and paginator are undefined (when and why - see spinner in '/all-videos' bug below; I suspect they are related)
- [ ] Spinner in '/all-videos' seems to go on forever under certain as yet unclear circumstances *until* you click something
- [ ] Stripe is broken; also, write a test for this? Related:
   - [ ] Brand new users are automatically appear subscribed, but don't have subscription or customer ids on firebase
- [ ] Stripe webhooks don't work correctly? -->
<!-- - [ ] Reputation Points displaying +10 to whatever firebase value has it at? (at least for brand new users?) -->
<!-- - [ ] Weird extra underline in mat-inputs (see how you solved this for all-videos filter input) -->
<!-- - [ ] Running the tests at least creates extra delete buttons in the main table -->
- [ ] Size of video frame grows as annotation count grows (and fills more space)
<!-- - [ ] In mobile, clicking on video doesn't let it stay embedded. -->
- [ ] Creating match and then clicking annotate match makes the nav bar disappear and cuts off the top part of the video?... didn't happen this time TODO
- [ ] the admin option doesn't appear for without admin status, but they (at least Dirt) can navigate to '/admin' and see somethings (but not delete things)... decide whether this is desired and give them the option to navigate through the UI
- [ ] /matches when you first login doesn't display until you refresh the page
- [ ] When you approve of a new move name, it messes with the alphabetical order of the root nodes until you refresh the page (e.g., adding a new move to disciplinary action, and disciplinary action moves to the bottom in the annotation tree)
- [ ] Reputation points are displayed even if logged out
- [ ] Navigating to another individual match messes with the video's attachment to the dom?
- [ ] Some annotation manipulations affect video play for another person's instance (test using aws version and localhost version?)
- [ ] Typing in a new athlete name and then changing to one in the dropdown menu will use the typed in one for the match.

- [ ] When another user adds and annotation, it does not appear in chronological order, even though it works fine when you enter them out of order yourself
- [ ] Router link in faq section goes to faq/payment rather than just payment
- [ ] If watching video and rate, navigates you to near end of video (may latest watched?)
- [ ] If one user rates a video, it stops for the other user
- [ ] Making an annotation sometimes take you back to the startpoint of the previous annotation (even it a different match???)

- [ ] Reputation and tracking
  - [ ]
- [ ] User creation
    - [ ] Dropdown menus need double clicking rn.
    - [ ] If you create a user, then log in via google with that same user, then try to log in again with email and password instead of google, it won't work (looking at firebase, I can see the user authenticated gets converted to a google user. This does not happen with this person's example app https://github.com/SinghDigamber/angularfirebase-authentication [although, they're using fireStore])
    - [ ] Currently, lets you create multiple duplicate accounts (?)
- [ ] Annotation
    - [ ] Deleting an annotation made by another user logs you in as that user (but you refresh as the original user)
    - [ ] Deleting several annotations (or certain annotations?) at least sometimes doesn't remove the chip from the DOM
    - [ ] Ending an annotation now does not pause and reset, but there's no delay and also the arrows don't switch disabled
- [ ] Video Player
    - [ ] Changing the annotation rating resets the video
    - [ ] Sometimes (but not always?), clicking the end move stops the video entirely
- [ ] Handle connection errors (e.g., the spinner just keeps going if there's no internet connection)
- [ ] Cannot figure out styling for add new athlete dropdown to draw attention (look at attention class in styles.scss and https://github.com/angular/material#building and https://youtu.be/V3WiBs-igaY)

# Mysteriously failing tests
- [ ] TODO make the signs up a new user test pass (see above list [cross-listed])

# Tabled issues
- [x] the timeline for a previous match might persist when a new match is clicked
- [x] the timeline annotation ticker doesn't have a line and scrolls by too quickly for some things to be clicked on

# Not sure what this is about anymore
- [x] //TODO createEventInVideo from form submission

# Resolved issues
<<<<<<< HEAD
- [x] Video automatically starts upon page view
- [x] FAQ looks terrible
- [x] Tests pass in isolation but not together (need something to emit "Stop" whenever I leave the page)
- [x] When you add a new item, the snackbar fires off
- [x] Collection added and collection already exists snackbars aren't displaying when they are supposed to
- [x] Adding a collection never dismissed the snackbar and it appears at the top
- [x] Deleting collection and then going immediately back to the collection form re-populates the database with the question that was just deleted
- [x] Deleting a collection does not make it disappear in the user display nor the database;
- [x] Leaving item from previous category blank and then you click new category, the item becomes required
- [x] Adding a collection that is identical but has additional content registers as equal in doesCollectionAlreadyExistInDb
- [x] Adding the collection to the database adds it twice
- [x] When you add a new item when there's already a blank one, it suddenly makes that blank one required
- [x] Clicking on add item in the middle categoryWithItem groups creates additional add category buttons
- [x] Collection creation still seems to be creating two objects; problem occurs when I enter the URL (at least) from all-matches
- [x] With collection form, when you submit, it only takes the most recent of each category (collection name, category name, item name)
- [x] Pressing enter in any textfield in collection creation form adds another field to category name
- [x] itemNames is hitting undefined not perfectly characterized conditions beyond x are replaced with same value
- [x] With collection form, if you click add another foo, it clears the whole form
=======
- [x] Rating the video starts the video
- [x] Video automatically starts upon page view
- [x] FAQ looks terrible
>>>>>>> master
- [x] Clicking annotate from video submission takes you to URLs like 'http://localhost:4200/all-videos-MDfiNImRptr9Rf8v9bR'
- [x] Last and first should be displayed on individual dialog box
- [x] Match and annotation ratings don't work
- [x] Weird extra underline in mat-input for filter
- [x] Annotated moves not displaying
- [x] Router not navigating to /login upon logout in auth guard bug
- [x] Clicking "annotate a video" from inside a match-display component loads some new info, but doesn't load a new video (works fine if navigating from /matches)
- [x] The YouTube player is not attached to the DOM. API calls should be made after the onReady event. See more: https://developers.google.com/youtube/iframe_api_reference#Events
- [x] Clicking the play button doesn't always work (i.e., sometimes the video API is attached, and sometimes it isn't) ... raised an issue with the software developer of the package: https://github.com/orizens/ngx-youtube-player/issues/48
- [x] Tooltips in match-display are very inconsistent (make sure it's not just when the dev tools are open? Currently seems to be the case)
- [x] After deleting a submission move in the admin page, TypeError: Cannot read property 'Choke Or Cervical Submissions' of undefined; after adding a move you see it, but this error occurs upon refresh...even if you don't add anything, a page reload produces this error
- [x] cannot read property expandable of undefined when you click guard passes or guard pass attempts
- [x] Alphabetical order not happening for moves that don't score points
- [x] Dropdown menu for new-move isn't in front
- [x] Deal with subcategory for submissions in move-name adding
  - [x] Section with move name added now seems expandable in its deepest level, when it should not be
  - [x] Trying to collapse an expand fails
  - [x] When you try to re-expand, it add items to the array (I think this won't be a problem if the above gets resolved)
  - [x] Deal with the case in which there are submission sub-trees
- [x] Adding an annotation with a created user doesn't work
- [x] View All Matches Button Remains upon logout for admin and over-ride ppl. alike (unknown for paid ppl.)
- [x] Rating a match toggles back and forth between your current vote and your old vote
- [x] Tests are failing because of unsubscription error
- [x] Winner declaration directive not working
- [x] Ending the annotation not working
- [x] Upon rating an annotation previously unrated, it will navigate you to another unrated video (possibly the next unrated video??)
- [x] Viewing Dirt's video and then clicking annotate a video takes you to a new video but doesn't update the annotations
- [x] Video icon not displaying on main window
- [x] Admin has more than 5 annotations, and it's still telling me to annotate (look at userHasAnnotatedEnough in database.service)
- [x] Deleting an annotation causes many many queries
- [x] Second time you annotate a move, it doesn't wait for end time and might have other issues as well in terms of mixing data with the previous entry
- [x] Removing an annotation currently creates a new annotation in user that's blank but not null
- [x] Annotating a second time below the submission multi-tree doesn't work
- [x] Creating a new user doesn't associate uid with them
- [x] Logging in after creating user and logging out changes paid status to trip
- [x] Deleting a user from the db when they're logged in creates a payment entry in the db
- [x] logout REST URL doesn't get rid of user in app.component
- [x] Adding an annotation doesn't add it to user correctly, even though it seems to add it to match correctly
- [x] Gi/Nogi on match-display says false
- [x] If you navigate to matches/undefined, it still shows something that looks somewhat like a match
- [x] Original poster ID is "users" right now and should be updated to the actual user's id
- [x] My admin user is being either removed or replaced by the next one?
- [x] If user is logged in and navigates to /login, it will still show them login stuff
- [x] Some of the tree loads forever (or at least for a long time?) when you're annotating your second+ move?
- [x] Adding a move to a video adds multiple annotations and it seems to have something to do with the move selection process
- [x] Datatable doesn't respond to deleted matches in real time
- [x] Creating new account makes status stuff visible, enables logout button but doesn't have user logged in
- [x] The title in the tab doesn't load
- [x] logging out with the dev console open is an issue and sometimes even without, logging out looks inconsistent
- [x] Creating a user gives them a different uid than they should have?
- [x] Move not being recorded in database
- [x] user-status-report stuff is not correctly fetching date from the user's last annotation
- [x] Fake user doesn't get a uid
- [x] annotate a move once and when it is done it does it again and finds the previous options unselected //TODO can't figure out why the button is not disabling. Seems to work fine when not in testing mode
- [x] Clicking the stuff deepest into the tree no longer works
- [x] should have begin move disabled and end move enabled after done have been clicked //TODO can't figure out why the button is not disabling. Seems to work fine when not in testing mode
- [x] If you log out and then try to click on annotate a video, it takes you to the lost page. // Seems to be resolved, although logging out with the dev console open is an issue and sometimes even without, logging out looks inconsistent
- [x] The first time you annotate a move, the annotation button toggles don't enable and disable as expected, but after that, they do
- [x] Clicking cancel in the annotation of move causes the begin move button to be disabled and the end move to be enabled
- [x] In the annotation, picking a move has to be the most recent thing you've done to call allValid(). I made this more ok by changing the order of the form, but still not great behavior.
- [x] logging out and logging back in makes the moves tree disappear
- [x] the youTube player isn't attached to the DOM upon logoff and log back in.
- [x] the tree in the form stays imprinted on the previously annotated move
- [x] Second time someone tries to annotate, nothing is reset
- [x] pauseAndAnnotate(currentTime: string) signature mismatches with video-display.component.html call
- [x] Doesn't resume play after Done for annotate a move is clicked
- [x] Cypress tests are still having issues with the chainable stuff
- [x] Clicking on matches takes you to /matches/matches instead of just one /matches
- [x] API key is currently public. Reset this.
- [x] The mat-tree stuff has a few issues:
- [x] all of the nested children are displayed without clicking on the parent
- [x] none of the children seem clickable
- [x] the parents are clickable, but nothing happens other than the focus of the chevron changes and the direction of the chevron changes
