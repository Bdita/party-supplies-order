PSaaS - Party supplies as a Service
-----------------------------------
**To run locally**
1. Clone the repository
2. Install the dependencies
```
$ pip install flask
$ pip install flask-cors
$ python -m pip install flask-pymongo
$ pip install pyyaml
```
3. Install mongoDB (for further instruction check https://docs.mongodb.com/manual/installation/)
4. Run the mongo database
4. Go inside the repository ```$ cd reponame ```
5. Run the backend with ```$ python psaas.py```
6. Open index.html in a browser.

7. To run the tests, ```$ python tests.py```

---
**About Project**
This was my solution to the task that had following requirements.
- a responsive web page with a form containing
  - name
  - a number input field to choose amount of party supplies (max 10)
  - a select field or radio buttons to choose which party supply (beers, chips
    or balloons)
  - all form fields are required
- beside this the web page lists all supplies previously ordered by other
  people at the party
  - what was ordered and which amount
  - who ordered it
- the web page is using a (Restful) API endpoint to retrieve the list of
  already ordered party supplies using an AJAX `GET` request
- the form details are submitted to the same (Restful) API endpoint to add new
  party supplies using a AJAX `POST` request.
- when adding a new party supply the list automatically update (for
  the given user who added the supply, not for other users having the page
  open)

- a special condition was implemented for adding new party supplies:
  - concurrent updates to the list of party supplies are not allowed
  - that means if two people load the web page (and see the list of already
    ordered party supplies) and person 1 orders new party supplies, person 2
    can not also order party supplies (as long he ordered after person 1)
  - person 2 need to retrieve the list of party supplies again before ordering
    new ones, person 2 can refresh the page in order to load the new list
  - person 2 can get an error message in case he tries to add a new party
    supply and the list was updated before that happened

---
**Requirements**

- use Python to write a backend to provide the API endpoint for retrieving
  list of already ordered party supplies and adding a new one. Choice of web
  framework is yours, but Flask might be a good candidate for something simple
  like this.
- How to store the party supplies in the backend is up to you. Simple
  solution is preferred
- The web page should be written in plain Javascript, HTML and CSS (no
  frameworks). You can use libraries to simplify some tasks like AJAX (but not
  something full fledged as jQUery)
- you can host the web page via the Python backend as well or just use a plain
  index.html file
- add form validation for the form in the web page (up to you how)
- add automated tests where you deem necessary, document steps how to run those
  tests
- document steps how to run your application in a local environment
- the time spent on the task is not relevant, but the quality of the result is.
  If you are unfamiliar with the tools and need time to learn them to some degree
  then please spend the time. (An experienced developer would probably spent
  between 2 to 4 hours to finish the task in good quality, but this is just a
  guideline and NOT a requirement)
- "Simple is better than complex"
- hint: the concurrent update behavior for bonus task has a simple solution as
  well. This has nothing to do with concurrent (CPU) processes and is a simple
  mechanism used commonly in HTTP requests (usually for PUT/PATCH requests
  though). Based on that approach there are even simpler solutions to achieve
  this and can be easily adjusted for our use-case.
