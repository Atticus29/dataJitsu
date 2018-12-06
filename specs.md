# TODO high priority
- [ ] Add test for starting and stopping an annotation
- [x] Fix test for clicking pause

# Bugs High Priority
- [ ] //TODO createMoveInVideo from form submission
- [x] pauseAndAnnotate(currentTime: string) signature mismatches with match-display.component.html call
- [ ] Gi/Nogi on match-display says false

# Bugs Low Priority

# Specs
- [ ] Users see the advice to annotate what the ref awards points to if the match was reffed (can included other positions/moves that didn't score points, but can't disagree with ref)
- [x] Users can log in
- [ ] Users can submit feedback about the site (which automatically captures which page the feedback was sent from)
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
