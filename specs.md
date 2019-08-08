# TODO high priority
- [ ] Have table auto-update when move details are revised?
- [ ] Monitor user's reputation points and enable privileges when things change
- [ ] Dialog for adding move names (if certain privileges; else, notify not enough privileges)
- [ ] Separate and gitignore the admin email and password and then go back through and erase
- [ ] Detect when the link url is different but other match specs are the same
- [ ] Update the weight classes of the matches that have already been made
- [ ] Tests
  - [ ] Improve deleting a match test
  - [ ] Flesh out 'created match appears on table' test
- [ ] Reset attemptStatus to true after every finished annotation
- [ ] Figure out a way to remove the api key and admin email and password from the repo (in an automated way)
- [ ] Fix bugs with logging out (sometimes you have to do it multiply)
- [ ] Set up CircleCI deploy to S3
- [ ] Test logging out from individual match
- [ ] Test rating the match and annotation (possibly as two different users)
- [ ] Add date annotated to move in match
- [ ] Make the match card display more info. (including date)
- [ ] Make password toggleable to be visible

# TODO low priority
- [ ] //TODO && submissionStatusValue stuff && attemptStatusValue stuff
- [ ] Remove match and annotation rating from matchDeets because they live elsewhere now
- [ ] Flesh out README with details about what it is and how it works
- [ ] Add more passes to moves.ts
- [ ] Add this.ngUnsubscribe.next(); and this.ngUnsubscribe.complete(); to ngOnDestroy in all modules (see all-matches.component.ts)

# Completed TODOs
- [x] Add cannot create duplicate match test
- [x] Indicate to the user that a match was created
- [x] Check for and prevent duplicate videos from being added
- [x] Have logout reload the page and/or resetAll from the tracker
- [x] Set up admin email and password on circleCI
- [x] Test adding a new match
- [x] Delete a match only as an admin
- [x] Add was this a successful attempt functionality
- [x] Record ratings in user
- [x] Creating a new match isn't working??
- [x] Test clicking deeper into the tree
- [x] Add test for starting and stopping an annotation
- [x] Add test for cancelling annotation (making sure certain buttons are and are not visible)
- [x] Add guard jump
- [x] Add advantages to moves list
- [x] Add move to the user who made it, and include a timestamp in the entry as well
- [x] //TODO make record of video here
- [x] Fix test for clicking pause

# Specs
- [ ] Admin status is tracked and admin can remove matches
- [ ] User can filter annotations by ones that scored points
- [ ] There's a way for a user to undo the most recent annotation they made?
- [ ] Users can look back 5 seconds or forward 5 seconds in a match
- [ ] Users see the advice to annotate what the ref awards points to if the match was reffed (can included other positions/moves that didn't score points, but can't disagree with ref)
- [ ] Users can submit feedback about the site (which automatically captures which page the feedback was sent from)
- [ ] Set up unit testing, especially for database stuff
- [ ] Users can view embedded videos that are annotated with moves
- [ ] Users can sort videos to view by any combination of:
  - [ ] Belt/rank
  - [ ] Tournament
  - [ ] Date (y, m ,d)
  - [ ] Athlete name
  - [ ] Second athlete name
  - [ ] Rule set
  - [ ] Move executed in the match
  - [ ] Rating from other users
  - [ ] Annotation Rating
- [ ] Users can view summary statistics by athlete:
  - [ ] Most common points scored
  - [ ] Most common points lost
  - [ ] Most effective submission
  - [ ] Most frequent thing they tap to
  - [ ] Users can view summary statistics by rank:
    - [ ] Most common points scored
    - [ ] Most common points lost
    - [ ] Most effective submission
- [ ] Users are required to annotate a video each month or pay $2/month or $6/6 months or $10/yr.
  - [ ] A video is provided for them
  - [ ] The first time they annotate, a tutorial is provided
  - [ ] A refresher tutorial is available
  - [ ] For every annotated video, the user is given more experience Points
  - [ ] For every time a users' annotated video is flagged as poorly-annotated or edited and then the edit is confirmed, they lose some experience points
      - [ ] Which annotations were done by which user is known to the database, but not to other users (to avoid personal vendettas)
  - [ ] while a user is annotating a video, that video is "locked" for annotation by other users?
  - [ ] alternatively, there is some way of dealing with two users simultaneously annotating the same video
  - [ ] Whether the user manually skips ahead in the video is tracked with the timestamp, is flagged for their annotation, and/or is not permitted in the app.
- [ ] Experience points are visible by other users
- [ ] Users are granted more responsibility and more data access if they:
  - [ ] Rate videos
  - [ ] Vet other users' new/alternative names of moves
  - [ ] Confirm dead links
- [ ] While viewing a video, users can:
  - [ ] Flag a link as dead
    - [ ] In which case, it immediately goes into a "is this link dead" pool
  - [ ] Flag a poorly-annotated video
  - [ ] Edit details of the video
    - [ ] In which case, it immediately goes into a "to be reviewed" pool
- [ ] Users can annotate a video by:
  - [x] User clicks "annotate" while the video is in play
    - [ ] If a move exists in that time point, that move is displayed to user. User is given option to:
      - [ ] Edit the existing move
        - [ ] The old move is replaced, but stored in the db but flagged as old
        - [ ] Immediately goes into a queue to be confirmed by others
      - [ ] Flag it for removal
      - [ ] Add a new move overlapping the original
        - [ ] Beginning time
        - [ ] End time
        - [ ] Points scored (if any)
        - [ ] Name of the performer of the move (which athlete did it)
        - [ ] Whether it was a submission
        - [ ] The name of the move
        - [ ] Users can create a new move name if it doesn't exist
          - [ ] This name must be vetted by other users

# Completed Specs

- [x] Users can log in
- [x] Users can create an account
  - [x] Name
  - [x] Email
  - [x] Rank (gi)
  - [x] Rank (no gi)
  - [x] Affiliation
  - [x] Age
  - [x] Gender
  - [x] Date last annotated (defaults to null)
  - [x] paidStatus
  - [x] Weight (find a way for the input to be in kilos or lbs.)
  - [x] Reputation points (defaults to 100)

- [x] Users can add a brand new video with match details:
  - [x] Tournament name
  - [x] Location
  - [x] Date
  - [x] Athlete 1 name
  - [x] Athlete 2 name
  - [x] Weight class
  - [x] Gender
  - [x] Age class
  - [x] Gi status
  - [x] Rank
  - [x] Video url
    - [ ] Gets validated?


A *match* is composed of *match details* and *moves*.

# Low priority specs
- [ ] Migrate to firestore?
