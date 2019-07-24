# Known issues
- [ ] Second time someone tries to annotate, nothing is reset
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

# Resolved issues
- [x] Doesn't resume play after Done for annotate a move is clicked
- [x] Cypress tests are still having issues with the chainable stuff
- [x] Clicking on matches takes you to /matches/matches instead of just one /matches
- [x] API key is currently public. Reset this.
- [x] The mat-tree stuff has a few issues:
- [x] all of the nested children are displayed without clicking on the parent
- [x] none of the children seem clickable
- [x] the parents are clickable, but nothing happens other than the focus of the chevron changes and the direction of the chevron changes
