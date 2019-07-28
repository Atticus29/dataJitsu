# Known issues
- [ ] the timeline annotation ticker doesn't have a line and scrolls by too quickly for some things to be clicked on
- [ ] the timeline for a previous match might persist when a new match is clicked
- [ ] logging out and logging back in makes the moves tree disappear
- [ ] should have begin move disabled and end move enabled after done have been clicked test is failing for an unknown reason
- [ ] Second time someone tries to annotate, nothing is reset
- [ ] Currently, lets you create multiple duplicate accounts
- [ ] When you submit a match, it asks you if you want to annotate, and if you click annotate, it doesn't take you anywhere
- [ ] Clicking cancel in the annotation of move causes the begin move button to be disabled and the end move to be enabled
- [ ] Sometimes (but not always?), clicking the end move stops the video entirely
- [ ] Adding a move to a video adds multiple annotations and it seems to have something to do with the move selection process
- [ ] The first time you annotate a move, the annotation button toggles don't enable and disable as expected, but after that, they do
- [ ] In the annotation, picking a move has to be the most recent thing you've done to call allValid(). I made this more ok by changing the order of the form, but still not great behavior.
- [ ] Clicking play doesn't play a video... raised an issue with the software developer of the package: https://github.com/orizens/ngx-youtube-player/issues/48
- [ ] Tooltips in match-display are very inconsistent
- [ ] Datatable doesn't respond to deleted matches in real time
- [ ] Creating new account makes status stuff visible, enables logout button but doesn't have user logged in
- [ ] Clicking the play button doesn't work
- [ ] The title in the tab doesn't load
- [ ] If you log out and then try to click on annotate a video, it takes you to the lost page.
- [ ] Video icon not displaying on main window
- [ ] Handle connection errors (e.g., the spinner just keeps going if there's no internet connection)
- [ ] //TODO createMoveInVideo from form submission
- [ ] Gi/Nogi on match-display says false


# Resolved issues
- [x] pauseAndAnnotate(currentTime: string) signature mismatches with match-display.component.html call
- [x] Doesn't resume play after Done for annotate a move is clicked
- [x] Cypress tests are still having issues with the chainable stuff
- [x] Clicking on matches takes you to /matches/matches instead of just one /matches
- [x] API key is currently public. Reset this.
- [x] The mat-tree stuff has a few issues:
- [x] all of the nested children are displayed without clicking on the parent
- [x] none of the children seem clickable
- [x] the parents are clickable, but nothing happens other than the focus of the chevron changes and the direction of the chevron changes
