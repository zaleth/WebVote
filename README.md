# WebVote
This is a web tool to facilitate online voting, with the assumption that voter registration is performed by a limited number of officials. Results are available in real-time, and there are no records kept connecting voters to the one-time codes they use to cast their votes.

# Other needed software
The code is written using React and Node, and it assumes that MongoDB is used as a database (connected using Parse).

# Data organization
At the top, there are any number of election days. Each election day has elections, and each election has candidates. Voter IDs are generated for each election day, and can vote in all elections for that day. It is not possible for individual voters to change their vote once cast, but the election can be cleared so that all voters may vote again.

# Software layout
The platform is split into three parts: admin, office and voter. Currently, they each have a separate Parse backend, but it is also possible to have them all run against the same backend. Obviously the database is shared.

The Admin component handles election setup; creating election days and adding elections and candidates to that day. The Office component generates voter IDs and displays the results of the vote. The Voter component is where each voter casts their vote using their voter ID (this is the 10-character object ID assigned by Parse).

It is intended that the Admin and Office parts be restricted, for example hosted on a private network, while the Voter part should be visible to the web at large. There is currently no authentication needed, but it can easily be added using the builtin User module of Parse.

# Quick installation
Currently the code is setup to run on localhost, using ports 3000-3002 for the webapp and 1337-1339 for the Parse backend. Frontend ports are set in the .env file for each page. I've tried deploying to Back4App, and it works well enough. Just remember that the initial user must be added to the database manually: choose any username and password you want and then update web-vote-admin/src/LoginPage.js accordingly. Once that is done you will need to play around a bit with database permissions, since the B4A ppl are smart enough to default to locked-down settings.