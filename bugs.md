# Known issues
- [ ] Router link in faq section goes to faq/payment rather than just payment
- [ ] If watching video and rate, navigates you to near end of video (may latest watched?)
- [ ] If one user rates a video, it stops for the other user

- [ ] Current most pressing
  - [ ] View All Matches Button Remains upon logout for admin and over-ride ppl. alike (unknown for paid ppl.)
  - [ ] Rating a match toggles back and forth between your current vote and your old vote
- [ ] Testing
  - [ ] Tests are failing because of unsubscription error
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
    - [ ] Clicking the play button doesn't always work (i.e., sometimes the video API is attached, and sometimes it isn't) ... raised an issue with the software developer of the package: https://github.com/orizens/ngx-youtube-player/issues/48
- [ ] Tooltips in match-display are very inconsistent (make sure it's not just when the dev tools are open? Currently seems to be the case)
- [ ] Handle connection errors (e.g., the spinner just keeps going if there's no internet connection)

# Mysteriously failing tests
- [ ] TODO make the signs up a new user test pass (see above list [cross-listed])

# Tabled issues
- [x] the timeline for a previous match might persist when a new match is clicked
- [x] the timeline annotation ticker doesn't have a line and scrolls by too quickly for some things to be clicked on

# Not sure what this is about anymore
- [x] //TODO createMoveInVideo from form submission

# Resolved issues
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
- [x] pauseAndAnnotate(currentTime: string) signature mismatches with match-display.component.html call
- [x] Doesn't resume play after Done for annotate a move is clicked
- [x] Cypress tests are still having issues with the chainable stuff
- [x] Clicking on matches takes you to /matches/matches instead of just one /matches
- [x] API key is currently public. Reset this.
- [x] The mat-tree stuff has a few issues:
- [x] all of the nested children are displayed without clicking on the parent
- [x] none of the children seem clickable
- [x] the parents are clickable, but nothing happens other than the focus of the chevron changes and the direction of the chevron changes
