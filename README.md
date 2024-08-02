# browser-etag-manipulation-validation
I would like to verify I'm able to reliable manipulate etags in all major browsers and that non of the browsers will override my provided etag

# Results:
* there seems to be no issue with manipulating etags in all major browsers
* there is one edge case in our usecase we might encoter when your provided a matching etag right away
  * in that case server will validate response contents, calculate hash and then just reply with 304
  * on browsers side, 304 responses do not have a body and there is no data stored in the browser cache
  * this case results in responses contents being just empty string
    