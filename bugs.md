# Known issues
- [ ] Clicking play doesn't play a video... raised an issue with the software developer of the package: https://github.com/orizens/ngx-youtube-player/issues/48
- [ ] Tooltips in match-display are very inconsistent
- [ ] Cypress tests are still having issues with the chainable stuff
- [ ] Datatable doesn't respond to deleted matches in real time
- [ ] Creating new account makes status stuff visible, enables logout button but doesn't have user logged in
- [ ] Clicking the play button doesn't work
- [ ] The title in the tab doesn't load
- [ ] If you log out and then try to click on annotate a video, it takes you to the lost page.
- [ ] Video icon not displaying on main window
- [ ] Handle connection errors (e.g., the spinner just keeps going if there's no internet connection)
- [ ] The mat-tree stuff has a few issues:
  - [ ] all of the nested children are displayed without clicking on the parent
  - [ ] none of the children seem clickable
  - [ ] the parents are clickable, but nothing happens other than the focus of the chevron changes and the direction of the chevron changes

# Resolved issues
- [x] Clicking on matches takes you to /matches/matches instead of just one /matches
- [x] API key is currently public. Reset this.
