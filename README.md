# Foreword
#### By: Adora Pham, Adrian Valdez, Sam Lim, Taran Bains, Owen Wong

## Our Mission
Our mission is to foster a culture of lifelong learning and critical thinking by empowering undergraduate students to build consistent, meaningful reading habits for pleasure. Through leveraging social connections, personalized goals, shared annotations, and tailored book recommendations, we aim to transform reading from an isolated activity into a vibrant, supportive community experience, helping students stay motivated, engaged, and connected to their reading journeys.

## Features
* Log in / create an account through Google Authentication
* Post ratings (0.0 - 10.0) and reviews for specific books
* Like and comment on ratings
* Search for books (title, author, genre)
* Add friends
* Set account to public/private 
* Achieve log in streaks

## Personas
Our personas used for development can be found here:
* [Jordan Kim](src/imgs/jordan-kim-persona.png)
* [Olivia Anderson](src/imgs/olivia-anderson-persona.png)

## Published Site
https://foreword-647d3.web.app/

# Development

## Built With
* React JS
* JavaScript
* HTML/CSS
* Firebase
* OpenLibrary API

## Testing Protocols

| | **Posting Ratings & Reviews** | **Adding Friends** |
|---|---|---|
| **Key Feature** | Verify that users can post a rating (0.0 – 10.0), optionally leave a comment, and that these posts are correctly visible to friends. Confirm that friends can interact by liking/disliking and commenting on posts. | Verify that a user can search for another user, send a friend request, and that the request can be accepted or declined. |
| **Test Steps** | 1. User logs in and navigates to search books<br>2. User selects a book and posts a rating (EX: 8.5) with a short comment<br>3. Friend of the user logs in and checks their Home page<br>4. Friend sees the post and clicks "like"<br>5. Friend adds a comment to the post | 1. User A logs in and searches for User B using the Friends page<br>2. User A sends a friend request to User B<br>3. User B logs in and sees the friend request<br>4. User B accepts the request<br>5. User A and User B both see each other listed as friends |
| **Success Criteria** | • Post appears on the user's Home page after submission<br>• Post appears on the friend's Home page (real-time or upon reload)<br>• Rating is displayed correctly ("8.5")<br>• Friend's like updates the post's like counter<br>• Friend's comment appears below the post<br>• All updates persist after refreshing the page | • Friend request appears in the targeted user's inbox<br>• Accepting the request updates both users' friend lists in real time or after refreshing<br>• Duplicate friend requests are prevented<br>• Declining the request removes it from the inbox and does not change friend lists |
| **Failure Criteria** | • Post does not appear after submission<br>• Rating is incorrect or not displayed<br>• Friend cannot see the post<br>• Likes or comments do not update or are not saved<br>• Comments/likes appear under the wrong post | • Friend request does not appear in targeted user's inbox<br>• Friend request is accepted but users are not added to each other's friend lists<br>• System allows duplicate or self-friend requests<br>• Unexpected behavior (friends being added to wrong accounts) |

## Known Bugs

# References
Davidovitch, N., & Gerkerova, A. (2023, July 26). (PDF) social factors influencing students’ reading habits. NetJournals. https://www.researchgate.net/publication/373151638_Social_factors_influencing_students’_reading_habits

