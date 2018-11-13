# restapi
JSON API for handling API calls for personal projects

## Testing

> some end points of interest:

> can be tested with Postman

> serving https://github.com/three-body-physics/Travelodge-deploy


``` bash


/api/home fetch blog entry data in JSON response

/api/home/entry/:id fetch a particular blog

/api/home make POST request with JWT token header and JSON object containing post data to create a new blog post

/api/home/entry/:id make POST request with JWT token and JSON object containing comment data to create a new comment at specified blog entry

/api/register make POST request with JSON object containing username/password to create new user acount.

/api/login make POST request with JSON object containing username/password to log in.

/api/home/user/:userId POST request route for user panel, it checks to see if user has admin privilege.

/api/home/entry/:id Route for deleting a particular blog post. 


```
